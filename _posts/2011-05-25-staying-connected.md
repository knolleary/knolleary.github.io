---
layout: post
title: Staying Connected
date: 2011-05-25
tags: ["arduino","currentcost","mqtt","tech"]
---

I've been running my [CurrentCost MQTT Bridge](/2011/04/04/currentcost-mqtt-bridge/) for a couple of months now and it has been working well, but for one thing; on occasion it would lose its connection and not reconnect.

It has taken some time to iron out the various issues that were causing this, but I think I've finally got there so I've updated the [gist](https://gist.github.com/900885) and herewith a run down of what it took to get things working properly.

Whenever the code realised it had lost its connection, it would simply try to re-establish the connection. Now, as soon as the connection is lost, it performs a reset of the ethernet hardware, re-obtains a DHCP address and runs the DNS query. If either of these latter stages fails to complete in a reasonable time, it loops back to the hardware reset.

In an earlier version of the reset code I wasn't timing out the DHCP look-up. On more than one occasion I spotted, thanks to Wireshark, that the DHCP request being sent by the Bridge had a source MAC value of 00:00:00:00:00 - which was correctly being ignored. Without a time-out, the bridge was stuck sending out invalid requests and waiting for a reply that wasn't coming. I haven't been able to identify exactly why the bridge appeared to have forgotten its MAC address, but to rule out the obvious, I added code to restore the MAC from EEPROM as a part of the reset code.

This combination of changes made things much more reliable, but there remained one final issue - it relied on the code noticing it had lost its connection. In most cases, this worked fine, but there was still a case where the bridge would be sat publishing its data with no-one listening.

MQTT has a facility that is supposed to deal with this; the keep-alive timer. But my MQTT library only implemented half of this feature - it ensured a ping was sent within the keep-alive time if nothing else was sent, but it never checked that it received the expected response. As the bridge code publishes data regularly but doesn't subscribe to any topics, then proper handling of the keep-alive pings is all the more vital to detecting loss of connection. I've made the necessary updates to the MQTT library on [github](https://github.com/knolleary/pubsubclient/tree/master/PubSubClient), but I haven't made a formal release of it yet.

The lesson to learn from this is that it is easy to write code that works most of the time, but when you're writing code to run on an unattended, embedded, device you need as many belts and braces as possible to ensure it keeps going.