---
layout: post
title: Queuing with MQTT
date: 2012-04-11
tags: ["mqtt","queue","redis","tech"]
---

A question has come up a couple times on the MQTT mailing list asking how it can be used for workload distribution; given tasks being published to a topic, how can they be distributed fairly amongst the subscribers. 

The short answer is that you can't - it isn't how things work in a publish/subscribe system. With MQTT, each subscriber is treated equal and every message published to a topic will go to every subscriber.

Despite the natural urge to shoehorn MQTT into any solution, the correct answer is to use the right tool for the job. In this case, something that provides proper queuing semantics to ensure each message is only consumed once - something like [Celery](http://www.celeryproject.org/) for example.

That said, let's have a look at one way you could shoehorn MQTT into this particular scenario.

First, lets define the scenario. Say, for example, you have a [stream of tweets being published to MQTT](/2012/04/04/streaming-tweets-to-mqtt/). Specifically a stream of all tweets that contain the text "4sq". Why would you do this? Well, as explained by [Matt Biddulph](http://www.hackdiary.com/) in his [Where 2012 workshop](http://www.slideshare.net/mattb/where-2012-prototyping-workshop), this gives you a feed of all check-ins on foursquare that have been shared on Twitter. Each tweet contains a url which gives you more metadata about the check-in. To do anything meaningful with the tweets, you need to retrieve the url, which, as it uses the foursqure url-shortener, requires two http requests.

The rate at which the tweets arrive, 25,000 an hour Matt suggests, makes it impractical to do anything but the most basic of operations on them. It certainly isn't practical to do the two http requests to retrieve the foursquare information for each tweet in real-time.

There isn't any real magic needed here; a single subscriber to the topic dumps the messages onto a queue of some form that can then have as many active consumers as makes sense for the scenario.

A couple of years ago, I would have jumped straight at dumping the tweets into a MySQL table - how very 2010. These days, it's so much easier to use something like redis.

<pre>
import redis
import mosquitto

// ...
// exercise for the reader to:
// - create MQTT client, connect it and subscribe to the appropriate topic
// - create a redis client and connect it
// ...

// on_message callback for the mosquitto client
def onmqttmessage(client,message):
    redis.lpush(message.topic,message.payload)
</pre>

The consumers then become simple redis clients that `[redis.brpop(topic)](http://redis.io/commands/brpop)` to get the next tweet to process. If you want to get extra fancy, then `[redis.brpoplpush(topic,processing_queue)](http://redis.io/commands/brpoplpush)` and a housekeeping thread lets you make sure nothing gets lost if a consumer dies unexpectedly.

Looking at this, you may ask why bother with MQTT at all? Why not just replace the MQTT publishing bits in the twitter streaming code with the redis putting bits? Well, I have used the word "shoehorn" three times in this post.