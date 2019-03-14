---
layout: post
title: Using MQTT with Pachube
date: 2011-04-07
tags: ["code","mqtt","pachube"]
---

![Pachube](/blog/content/2011/04/pblogo.png "Pachube")
I have been thinking about how MQTT could be integrated into [Pachube](http://pachube.com), as a service that utilises their [public API](http://api.pachube.com/v2/). With their [Hackathon](http://community.pachube.com/iot_hackathon) happening tomorrow, which I'm unable to attend, it felt like a good time to write up what I've done.

### Basic Pachube concepts

The way Pachube structures data lends itself well to a topic hierarchy:

*   An Environment is a logical collection of datastreams. It can be used to represent a physical location, such as my house.
*   A Datastream represents a single sensor/device within a particular environment, such as living room temperature.
*   A Datapoint is a point-in-time value on a datastream

Data is sent to Pachube using HTTP POST requests. It can retrieved by either polling a datastream's value, or by configuring a trigger. A trigger is a push notification that happens when a defined condition occurs. This notification exists as an HTTP POST from Pachube to the URL configured as a part of the trigger. The POST contains a json payload that contains the details of the notification. There are some limitations on data-rates around triggers; the minimum interval between the same trigger firing is 5 seconds.

All access to the API is controlled using API Keys. Each request to the API must be accompanied with either the `X-PachubeApiKey` HTTP header, or as a request parameter.
Each user has a master API key which gives full access to their account. Additional API keys can be created with different levels of access for a particular user.

The following scheme uses the API key as a part of the topic strings used. This relies on the broker having been configured to disallow any client to subscribe to the wild-carded topic "pb/#". Beyond that, no more security is assumed (ie username/password, SSL etc), but of course could be added.

There are two components to this; an MQTT subscribing application that can bridge into Pachube and an HTTP listening application that can bridge from Pachube triggers into MQTT.

### Publishing to Pachube

A datapoint value is published to the topic:
<pre>pb/<api key>/<environment id>/<datastream id></pre>
which is received by the subscribing application, leading to it sending an HTTP PUT of the datapoint to the Pachube API:
<pre>http://api.pachube.com/v2/feeds/<environment id>/datastreams/<datastream id>.csv</pre>
with header property:
<pre>X-PachubeApiKey: <api key></pre>

No pre-configuration is needed here - it relies on the provided API key having the correct permission to update the datastream. There are some questions here on how to handle failures to post (permission denied, service unavailable etc), as there is no mechanism to report failures back to the originating publisher.

### Subscribing to Pachube

Subscribing to a datastream is slightly more involved as it requires an HTTP intermediary for Pachube to push its notifications to which can then be forwarded to the broker. There is also no way to automatically create the trigger when a client subscribes to a topic on the broker, so an additional configuration step is required of the client. It is also possible to configure multiple triggers for a single datastream, so we cannot use a simple one-to-one mapping of datastream to topic for the outbound flow. This causes an asymmetry between publishing and subscribing, but I think it is necessary.

A trigger is configured by publishing to the topic:
<pre>pb/<api key>/<environment id>/<datastream id>/trigger</pre>
with a payload that defines the trigger in json, for example:
<pre>{
   "topic":"lt15",
   // As defined in the pachube API: 
   "url":"http://example.com/pachubeBridge/callback",
   "threshold_value":"15.0",
   "trigger_type":"lt"
}</pre>
This causes the appropriate HTTP PUT to the Pachube API to create the trigger.

The trigger is configured with the url of the HTTP intermediary that is able to react to the HTTP POSTs sent by Pachube by publishing the value to the corresponding MQTT topic. This means clients can subscribe to:
<pre>pb/<api key>/<topic></pre>
to receive the updates as they are received.

As an aside, there could be an option to make the trigger feed 'public' on the broker, so a user's API key doesn't need to be shared. This would mean the trigger would get published to something like:
<pre>pb/public/<topic></pre>

To unsubscribe, the trigger needs to be deleted on Pachube. This is done by publishing to the same topic as was used to create the trigger, but with a payload that includes a 'delete' command.

### The bit at the end

I have implemented pretty much all of what I describe above and it works. Although there are some drawbacks with the approach:

*   The rate-limiting that Pachube applies to triggers (at least 5 seconds between firings) defines the minimum granularity for getting data out to MQTT - so potentially values could be missed.
*   Subscribing to a datastream is not as simple as subscribing to a topic.
*   No consideration is made of the additional meta-data that is provided with the HTTP requests - this is very much just about the raw data points

In an ideal world, the MQTT interface would sit much closer to the centre of Pachube and be more of a 1st class API citizen; but then I want to MQTT enable everything.

Unfortunately I don't have the wherewithal to make it public facing for other's to play with at the moment, which is a shame. If you're really interested in seeing it in action, get in touch and I'll see what can be done.