---
layout: post
title: Moving energy readings from MySQL to redis
date: 2012-08-30
tags: ["tech"]
---

I've been running a site for the [Chale Community Project](http://www.chalecommunityproject.com/) for a while now that allows members of the community monitor their energy usage online.

_`tl;dr;` I changed some code that was using MySQL to store meter readings to use redis instead. The rest of this post describes some of the design decisions needed to make the shift._

The energy readings are published using a version of my [modified CurrentCost bridge](/2011/04/04/currentcost-mqtt-bridge/) over MQTT. As well as the whole house reading, a meter might have a number of individual appliance monitors attached. Each of these readings is published to its own topic in a very simple hierarchy:
<pre>sm00/CF35D16315BF93EC053E4EFFC614E3E944C2A626/1/2</pre>
The first two topic levels identify the meter and the second two identify the individual devices attached.

With readings arriving for each device every 6 seconds, I started with simply dumping them into MySQL - with each level of the topic as a column in the table, thrown in with a timestamp. As this granularity of data isn't needed for the site, a job could then run every 10 minutes to average the readings into 10 minute slots and put them into another table. This was good enough at the time, but it wasn't a long term solution.

Aside from some serious normalisation of the database (adding the 40 character meter ID in every row turned out not to be the most efficient thing to do), I wanted to move to using redis for the live data. There were a few reasons for this, but primarily it was a combination of wanting to lighten the load on the (shared) MySQL server, as well as to do something more interesting with redis.

The shift from relational table to key-value store required a change in mindset as to how to store the readings. The main requirement was to minimise the work needed to store a reading as well as the work needed to calculate the average reading for each device.

Redis provides a list data type which, when using the receiving topic as the key, is a perfect fit for storing all of the readings for a particular device. But that causes problems in generating the average as the list will contain all values for the device, not just the values for a particular 10 minute timeslot.

The solution is to simply add the timeslot to the key. The timeslot is the current time, such as `2012-08-20 15:21:34` with the last three digits set to 0 - `2012-08-20 15:20:00`.

This leads to keys such as:
<pre>20120820152000:sm00:CF35D16315BF93EC053E4EFFC614E3E944C2A626:1:2
20120820153000:sm00:CF35D16315BF93EC053E4EFFC614E3E944C2A626:1:2</pre>

That gets the readings stored pretty efficiently, already split into a list-per-device-per-timeslot.

The task of averaging the lists could then just look at the current time, generate the timeslot string for the _previoius_ timeslot, retrieve all keys that begin with that string and process all the lists. But there are two problems with this approach.

First, redis doesn't recommend using its `KEYS pattern` command in production. I doubt this system would ever scale to the point where the performance hit of that command became an issue, but still, it's worth sticking to the appropriate best practices.

The second issue is that it makes a big assumption that the only timeslot that needs to be processed is the previous one. If the task fails to run for any reason, it needs to process all of the outstanding timeslots.

This needed one of the other data types available in redis; the sorted set. This allows you to have an ordered list of values that are guaranteed to be unique. When each reading arrives, the timeslot value is put into a sorted set called, imaginatively, '`timeslots`'. As it is a set, it doesn't matter that the same timeslot value will be put into the set thousands of times - it will only result in a single entry. As it is sorted, the task doing the averaging can process the outstanding timeslots in order.

Finally, a normal set is used to store all of the reading keys that have been used for a particular timeslot. As this is per-timeslot, the key for the set is '`readings:`' appended with the timeslot.

So, with that in place, the averaging task takes the follow steps. 

1.  Gets the list of timeslots that there are readings for from the sorted set `timeslots`.
2.  For each timeslot, that is not the current one:

        1.  Remove the timeslot from the set
    2.  Get the list of reading keys from list `readings:_timeslot_`
    3.  For each reading key, retrieve the list, calculate the average, insert it into the MySQL table and delete the list
    4.  Delete the `readings:_timeslot_` list

And that is what I've had running for a few weeks now. No grand conclusion.