---
layout: post
title: Bridging MQTT from RSMB to Cosm
date: 2012-06-09
tags: ["cosm","mqtt","rsmb","tech"]
---

[Cosm](http://cosm.com), formerly known as Pachube, has had MQTT support for a while now and I've been meaning to do something with it.

One of the strengths of a publish/subscribe system, such as MQTT, is the decoupling of the producers and consumers of messages. I don't have to modify the code that reads my energy usage from the CurrentCost meter each time I think of a new use of the data - I just add a new, self-contained, subscriber.

So to get my energy usage data into a datastream on Cosm, I could simply write a client that subscribes to the `house/cc/power` topic on my home broker and republishes it to the appropriate topic on the Cosm broker.

But even that's far more work than is really needed - why write code when the broker can do it for me? RSMB lets you create bridge connections to other brokers and define how topics should be mapped between them. Now, I've done this plenty of times, but I still get confused with the topic-mapping syntax RSMB uses in its config file. So, for future reference, here's how to do it.

<pre>
connection cosm
try_private false
address 216.52.233.121 1883
username <COSM_API_KEY>
clientid knolleary
topic "" out house/cc/power /v2/feeds/62907/datastreams/0.csv
</pre>

The `topic` line shows how you can achieve a one-to-one mapping between different topics - the non-obvious part being the need to have the empty "" as the topicString.

If you are using Mosquitto, an additional parameter is needed in the `topic` line to specify the QoS to use:
<pre>
topic "" out 0 house/cc/power /v2/feeds/62907/datastreams/0.csv
</pre>

Going the other way, subscribing to a feed on Cosm, is just as easy:

<pre>
topic "" in inbound/cosm /v1/feeds/XXXXXX/datastreams/0.csv
</pre>
Or, if you are using Mosquitto:
<pre>
topic "" in 0 inbound/cosm /v1/feeds/XXXXXX/datastreams/0.csv
</pre>

Note the use of `/v1/` in the remote topic string this time around. As [documented](https://cosm.com/docs/beta/mqtt/#retrieving-data), this gets you just the raw data value, rather than the comma-separated time-stamp and data value returned by the `/v2/` api. Of course, depending on what you're doing, you may want the time-stamp. Equally, you may want the full JSON or <shuddder> XML formats - in which case you would change the `.csv` to `.json` or `.xml` respectively.

In a future post, I'll look more at how the topic-mapping in RSMB (and Mosquitto) can be used to good effect in scaling an MQTT system.