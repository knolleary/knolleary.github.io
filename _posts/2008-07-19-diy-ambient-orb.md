---
layout: post
title: DIY Ambient Orb
date: 2008-07-19
tags: ["aduino","ambient orb","blinkm","tech"]
---

Take one garden light bought at M&S for £3.50 and dissect it:

[![Dissected Ambient Light](https://farm4.static.flickr.com/3271/2677692719_b190dd87a4_m.jpg)](http://www.flickr.com/photos/knolleary/2677692719/ "Dissected Ambient Light by nol, on Flickr")

Connect a BlinkM up to an arduino and set it running:

[![BlinkM](https://farm4.static.flickr.com/3003/2678486840_d44e89c6a9_m.jpg)](http://www.flickr.com/photos/knolleary/2678486840/ "BlinkM by nol, on Flickr")

Combine the two and you have a home-brew ambient orb:

<div style="text-align: center;"><object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="437" height="370" id="viddler"><param name="movie" value="http://www.viddler.com/player/a1ed283b/" /><param name="allowScriptAccess" value="always" /><param name="allowFullScreen" value="true" /><embed src="http://www.viddler.com/player/a1ed283b/" width="437" height="370" type="application/x-shockwave-flash" allowScriptAccess="always" allowFullScreen="true" name="viddler" ></embed></object></div>

Next step, do something interesting with it.

I've been on the lookout for suitable materials to make an ambient orb for a while - particularly something to diffuse the light. My original plan, which I may still do, was to take an ordinary lightbulb and put an RGB led inside it. However, modern lightbulbs prove quite tricky to take apart without shattering something.  When I spotted these lights in M&S last week I knew they were exactly what I wanted. So I bought three.

They were pleasingly easy to dissect - just some gentle persuasion with a craft knife. The led's they come with, which you can see [here](http://flickr.com/photos/knolleary/2677693893/), are going to be handy to reuse in the future.

I still need to work out how best to mount the BlinkM beneath it. Given their I2C interface, it is going to be very easy to chain lots of them together, working as a group.

Ambient orbs are fascinating interfaces - they provide an abstraction that can convert an data source into a simplified, yet powerful, source of information.

Converting data into information is something I have been meaning to write about for a while. But given it's my wife's birthday and we're heading out for the evening in 5 minutes, that post will have to wait for another day.
