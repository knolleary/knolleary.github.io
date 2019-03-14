---
layout: post
title: Twitterlogue
date: 2009-08-07
tags: ["life"]
---

For the next few weeks we're going to be driving across New Zealand in a camper van. With Vodafone having suspended roaming charges abroad for the summer, I realised last week I would be able to freely twitter as we go. Whilst that in itself could end up being an good record of the trip, I couldn't help feel it would be missing something.

The tweets would help record what we were doing, but they would lose the where. So, after a few hours hacking, I have created a real-time [twitterlogue](http://knolleary.net/trip/) of the trip.

[![Twitterlogue Screenshot](/blog/content/2009/08/aukland.png "Twitterlogue Screenshot")](http://knolleary.net/trip)

This is a simple mash-up of a twitter feed along with a google map of where we were when I sent the update. As we're driving, it also records how far we've driven at that point.

Under the covers it works like this... I send a direct message to my sekret twitter account using the format:
<pre>[lat,long] [distance] [message]</pre>

When the dm is received, the information is injected into a database which feeds the page. It also sends the update, sans GPS/distance, to my [twitter](http://twitter.com/knolleary) account, including a link to the update on the map. As each update has its own permalink on the map they are individually linkable. Awesome.

![trip-screenshot](/blog/content/2009/08/trip-screenshot.jpg "trip-screenshot")

To make life easier on the road, and because I can, I've put together a little python app for my phone that gathers the GPS location and lets me enter the other information before sending it off to twitter.

Had I more time, it would have been cool to pull in photos I've taken around the time of the update. But given I'm not sure how often I'll be uploading photos whilst out there, I thought it better to leave it for now.

I'm not aware of any existing service that does quite this sort of travelogue thing - I wonder if there's something more generic that could be spawned from this.

It's had some simple testing but it could well break whilst we're away and there'll be little I can do about it.

(sorry, no bonus points for working out where I was when I took the screenshot of the phone app)
