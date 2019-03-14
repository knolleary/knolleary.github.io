---
layout: post
title: Updated Arduino MQTT Client
date: 2010-12-27
tags: ["tech"]
---

I've been a bit remiss in keeping up with new releases of the [Arduino](http://arduino.cc/en/Main/Software) software. The current Ethernet library has introduced some changes that broke my MQTT library -  a fact I only discovered earlier today when playing with the newly released 0022 version. Coincidently, so did [Andy](http://knolleary.net/arduino-client-for-mqtt/#comment-15348) - who reports it has been broken since 0021.

Luckily, it's a minor fix, which I've now made [available](http://knolleary.net/arduino-client-for-mqtt/). I've also updated the sample sketch to reflect the fact you must manually include `SPI.h` if you use the Ethernet library.

On a related note, Adrian has released updated versions of his [DHCP and DNS libraries](http://www.mcqn.com/weblog/dhcp_and_dns_arduino) which will hopefully make their way into the official distribution in the near future.

_Update:_ [Andy](http://twitter.com/#!/andypiper/status/19496687420579840) has also reported that the library works with the [SparkFun WiFly Shield](https://www.sparkfun.com/products/9954). Thanks Andy!