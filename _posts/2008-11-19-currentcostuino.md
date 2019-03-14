---
layout: post
title: CurrentCostuino
date: 2008-11-19
tags: ["arduino","code","currentcost","ethernet","mqtt","PubSubClient"]
---

With [homecamp](http://homecamp.pbwiki.com/) fast approaching I spent some time last weekend reviving some CurrentCost hacking I started in the summer.

One of the downsides of the data connection on the CurrentCost is the need for an always-on computer in order to capture the data. In practice, the existence of low powered machines like the MPC-L, or slug, make this a pretty inconsequential downside. That said, it was enough motivation to see what I could do with an Arduino and Ethernet Shield.

I have [previously](/2008/05/05/power-graphing/) mentioned that part of the setup used to graph the power data online was to publish the data to a broker-in-the-sky using MQTT. To achieve this with an arduino it was clear that I needed one thing in particular - an arduino that is capable of connecting and publishing to an MQTT server.

With my ethernet shield in hand, I set about implementing enough of the MQTT spec to support basic publishing and subscribing. With that working, I looked into getting the arduino and CurrentCost talking. Thanks to [Alexis](http://e.inste.in/2008/06/16/interfacing-the-currentcost-meter-to-an-arduino/), this was very straightforward, although I did rework the parsing of the data to take advantage of its somewhat-fixed length format.

Here's the sketch I ended up with:

<pre>
#include <Ethernet.h>
#include <PubSubClient.h>
#include <SoftwareSerial.h>

byte mac[] = {  0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED };
byte ip[] = { 172, 16, 0, 50 };
byte server[] = { 172, 16, 0, 103 };

PubSubClient client(server, 1883,0);

#define rx 6
#define tx 7

SoftwareSerial softSerial =  SoftwareSerial(rx, tx);

void setup()  {
  pinMode(rx, INPUT);
  pinMode(tx, OUTPUT);
  softSerial.begin(9650);
  Ethernet.begin(mac, ip);
  delay(500);
}

void connect() {
  while(!client.connect("nolcc")) {
    delay(10000);
  }
  delay(200);
}

int offset = -1;
void loop() {
  if (!client.connected()) {
    connect();
    offset = -1;
  }
  client.loop();

  // scan the data for <msg>
  while(offset == -1) {
    char c = ' ';
    while (c!='<') {
      c = softSerial.read();
    }
    if (softSerial.read()=='m' &&
        softSerial.read()=='s' && 
        softSerial.read()=='g' &&
        softSerial.read()=='>') {
      offset = 5;
    }
  }

  // skip to the current value
  while(offset < 156) {
    offset++;
    softSerial.read();
  }
  char current[5];
  int value = 0;
  for (int i=0;i<5;i++) {
    current[i] = softSerial.read();
  }
  offset += 5;

  // skip to the temperature value
  while(offset < 243) {
    offset++;
    softSerial.read();
  }
  char temp[5];
  for (int i=0;i<4;i++) {
    temp[i] = softSerial.read();
  }
  offset += 4;

  client.publish("current",(uint8_t*)current,5);
  client.publish("temp",(uint8_t*)temp,4);

  // scan for </msg>
  while(offset != -1) {
    char c = ' ';
    while (c!='<') {
      c = softSerial.read();
    }
    if (softSerial.read()=='/' && 
        softSerial.read()=='m' &&
        softSerial.read()=='s' &&
        softSerial.read()=='g' &&
        softSerial.read()=='>') {
      offset = -1;
    }
  }
}
</pre>

It publishes each power reading to a topic called 'current' and each temperature reading to a topic called 'temp'. This isn't quite the right configuration for the existing broker setup, but it wouldn't take much to modify it appropriately.

You'll note this sketch isn't much use without the library that does the MQTT bit. Luckily, I have been given permission to release the library to the world. I should stress at this point, in case it wasn't obvious from the fact I am releasing this code on my _personal_ site, that my employer has nothing to do with it.

You'll find the Client for MQTT library [here](http://knolleary.net/arduino-client-for-mqtt/).

If you want an MQTT server to play with, go buy [Lotus Expeditor](http://www-01.ibm.com/software/lotus/products/expeditor/) to get your hands on a microbroker <gratuitous-plug />, or check out the links on [mqtt.org](http://mqtt.org) for the Really Small Message Broker.