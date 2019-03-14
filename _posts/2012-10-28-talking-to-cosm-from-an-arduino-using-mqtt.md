---
layout: post
title: Talking to Cosm from an Arduino using MQTT
date: 2012-10-28
tags: ["arduino","cosm","mqtt","pachube","PubSubClient","tech"]
---

Cosm has had MQTT support for some time now and I've had my home energy usage bridged up there from my local RSMB quite happily. One thing I hadn't played with properly was talking to Cosm directly from an Arduino - aside from a 5 minute proof-I-could-do-it. 

I'm putting together a new release of the PubSubClient, and having had the occasional report of problems talking to Cosm with it, I decided to see where things stood. Sure enough, the connection was pretty unstable; often failing to connect, hanging and certainly not reliably sending or receiving messages.

Knowing the client was producing perfectly valid MQTT packets and works with other brokers, the problems had to either exist in the network connection to Cosm or with their broker implementation. The fact my RSMB bridge to Cosm work from the same network ruled out a fundamental network issue. Equally, there are plenty of MQTT brokers on-line these days to check it wasn't a problem with the Arduino talking to a remote broker, rather than one on the same subnet.

Having debugged this sort of thing with other implementations, I had a good idea what the issue was; splitting MQTT packets over multiple TCP packets - something I knew the PubSubClient did.

When reading an MQTT packet from the network, it's easy to assume that a read from the network will provide the next byte of the packet. When testing on local networks, that will mostly be true. But when dealing with internet-scale lag between TCP packets, the code doing the reading must handle the case when the next byte hasn't arrived yet. This is what I think the Cosm broker is tripping over.

A quick test compared writing the packets to the network with multiple calls versus doing it with a single call and saw all of the reliability issues disappear. So I decided to update the client library to do just that.

If all you're after is working code, then you can grab the latest library from [GitHub](https://github.com/knolleary/pubsubclient). Note that this code includes an API change on each of the constructors - you need to provide an instance of `EthernetClient` rather than leave it to the library to create one. You can see what I mean in the updated [examples](https://github.com/knolleary/pubsubclient/tree/master/PubSubClient/examples).

In case you're interested, here's a run down of the changes I had to make to get this to work.

For the purposes of this exercise, an MQTT packet consists of three components; a single-byte header, between 1 and 4 bytes encoding the remaining length and finally the remaining payload bytes. The existing library provides a function that takes the header and payload, calculates the remaining length bytes and writes each of them to the network in turn - in other words, three separate network writes.
<pre>
boolean PubSubClient::write(uint8_t header, uint8_t* buf, uint16_t length) {
   uint8_t lenBuf[4];
   uint8_t llen = 0;
   uint8_t digit;
   uint8_t pos = 0;
   uint8_t rc;
   uint8_t len = length;
   do {
      digit = len % 128;
      len = len / 128;
      if (len > 0) {
         digit '= 0x80;
      }
      lenBuf[pos++] = digit;
      llen++;
   } while(len>0);

   rc = _client->write(header);
   rc += _client->write(lenBuf,llen);
   rc += _client->write(buf,length);
   lastOutActivity = millis();
   return (rc == 1+llen+length);
}
</pre>

The crude way to reduce the network writes would be for the function to copy all of those bytes to a single buffer and then pass that single buffer to the network. But that would involve a lot of unnecessary copying of bytes around as well as the increased memory usage for the buffer.

<pre>
   // Allocate yet more memory
   static uint8_t packet[MQTT_MAX_PACKET_SIZE];
   pos = 0;
   packet[pos++] = header;
   for (int i=0;i<llen;i++) {
      packet[pos++] = lenBuf[i];
   }
   // Copy lots of bytes around   
   for (int i=0;i<length;i++) {
      packet[pos++] = buf[i];
   }
   rc += _client->write(packet,pos);
</pre>

There is already a buffer used for incoming packets which can be reused for the outgoing packets. The difficulty is the remaining length bytes; until the payload is constructed the code doesn't know how long it will be, which means it does not know how many bytes are needed to encode the length. Without knowing how many bytes are used to encode the length, the client doesn't know the offset into the buffer to start writing the payload.

The trick is knowing that there will be at most 4 bytes of length and one of header - so the payload can be written starting at the 6th byte of the buffer. Then, once the length bytes are calculated, they can be inserted into the buffer working back from the 5th byte and the header byte can be inserted ahead of the length bytes. This gets the MQTT packet into a single contiguous buffer, with minimal copying of bytes, which can be passed to the network - albeit starting at a known offset from the start of the buffer.

<pre>
   // llen is the number of length bytes
   buf[4-llen] = header;
   for (int i=0;i<llen;i++) {
      buf[5-llen+i] = lenBuf[i];
   }
   rc = _client->write(buf+(4-llen),length+1+llen);
</pre>

Simple as that.

There is one place in the library that can't be reduced to a single network write; the recently added `publish_P` function allows the message payload to be stored in `PROGMEN`. The benefits that brings would be entirely lost if they were then copied into regular memory before writing to the network. Not much to be done about that.