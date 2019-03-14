---
layout: post
title: Streaming Tweets to MQTT
date: 2012-04-04
tags: ["mqtt","tech","twitter"]
---

For a demo I'm putting together at work, I needed to have tweets available on an MQTT topic. The whys and wherefores of the demo might be something I'll write about in the future, but for now, this post is about getting the tweets into MQTT.

To be honest, it is pretty trivial. The Twitter Streaming API is [well documented](https://dev.twitter.com/docs/streaming-api) and can be used to get a stream of tweets based on whatever search terms you choose. As each tweet is received, it just needs to be published with an MQTT client to the topic of choice.

It's barely worth a blog post.

I've put the code up on [github](https://github.com/knolleary/twitter-to-mqtt).