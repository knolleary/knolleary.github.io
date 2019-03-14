---
layout: post
title: Updated Arduino MQTT Client
date: 2010-07-20
tags: ["arduino","mqtt","tech"]
---

There's an updated version of the Arduino MQTT client [available](https://pubsubclient.knolleary.net). This fixes a bug where if the client lost its connection, you had to explicitly call disconnect before you could reconnect.

Not a major issue, but one that had caught a few people out.
