---
layout: post
title: Multi-Channel Ambient Orb
date: 2009-12-14
tags: ["ambient orb","tech"]
---

I've had my [orb](/2008/11/25/diy-ambient-orb-redux/) sat beside my TV for over a year now and it has served its purpose very well. I've never got beyond using it to display my energy usage - or more specifically, to display when my energy usage is above 'normal'. This has always felt a bit of waste; only using 2 colours out of the entire spectrum.

Over tea with Andy a few weeks ago, we managed to place our collective fingers on a basic problem with ambient orbs like this; whilst they may be capable of displaying any colour, the key thing is they can only display one colour at a time - they are a single channel of information.

For example, if I used blue to signify new messages for me on twitter, what should the orb do when my energy goes over 500 watts and someone has @knolleary'd me? The orb could alternate between the two colours, but that would feel too distracting for what is supposed to be an ambient device. A third colour could be defined for this combined state, but that wouldn't scale very well.

This train of thought brought us to identify what it would take to have an ambient orb capable of displaying more than one piece of information at any time. When put like this, the answer is fairly obvious; have an orb that can glow more than one colour at any time. An evening of soldering later, here's where I got to.

<div style="text-align: center;"><object type="application/x-shockwave-flash" width="400" height="300" data="http://www.flickr.com/apps/video/stewart.swf?v=71377" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"> <param name="flashvars" value="intl_lang=en-us&photo_secret=669ba69039&photo_id=4185280955"></param> <param name="movie" value="http://www.flickr.com/apps/video/stewart.swf?v=71377"></param> <param name="bgcolor" value="#000000"></param> <param name="allowFullScreen" value="true"></param><embed type="application/x-shockwave-flash" src="http://www.flickr.com/apps/video/stewart.swf?v=71377" bgcolor="#000000" allowfullscreen="true" flashvars="intl_lang=en-us&photo_secret=669ba69039&photo_id=4185280955" height="300" width="400"></embed></object>

[![Multi-Channel Ambient Orb](https://farm3.static.flickr.com/2496/4175226248_b9930d32c9.jpg)](http://www.flickr.com/photos/knolleary/4175226248/ "Multi-Channel Ambient Orb by knolleary, on Flickr")</div>

The orb has three RGB leds in it that are individually controllable. When they all show the same colour, the orb is a solid colour, but when they are different, the orb displays multiple colours at once.

This one doesn't use blinkm's for the simple matter of cost - I found a supply of the leds on e-bay that got me 50 for £15 - although this does mean I need to implement fading between the colours.

The plan is to put a small controller in the base to drive all the leds - for now it's plugged straight into an arduino.