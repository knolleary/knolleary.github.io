---
layout: post
title: Orb&#58; The LED Board
date: 2012-04-02
tags: ["ambient orb","orb"]
---

_[ part of the [orb series](/orb/) ]_
![](/blog/content/2012/04/orb-03.png "orb-03")
The top board in the Orb is the most simple - all it needs is three RGB LEDs and their resistors.

A quick [search on ebay](http://www.ebay.co.uk/sch/i.html?_nkw=5mm+8Kmcd+Common+Anode+Super+Flux+RGB+LED) found a good supply of LEDs similar to those used on the BlinkMs. The datasheet on the auction listing gave me all the information I needed to start laying out the PCB.

I considered writing a more detailed post about using Eagle, but there are plenty of tutorials out there already ([here's](http://www.sparkfun.com/tutorials/108) the Sparkfun one that got me started).

The Eagle files for the board are on [github](https://github.com/knolleary/multi-channel-orb/tree/master/pcb/orbA).

With that done, I looked around at options for getting the PCB made. [Olimex](http://www.olimex.com/pcb/index.html) had been recommended to me by a colleague, but to be honest I found their long list of design rules quite overwhelming for a first timer. I eventually settled on [SeeedStudio's Fusion PCB service](http://www.seeedstudio.com/depot/fusion-pcb-service-p-835.html) - who provide their own Eagle design rules file for you to run against your design. It worked out at about £1 for each board - which seemed pretty reasonable and you get 10 of them to play with.

The only downside was the wait - it took just over three weeks for the boards to arrive. Rapid prototyping for those not in a hurry.

[![PCB #1](https://farm7.staticflickr.com/6206/6150514893_39d84a7448_q.jpg)](http://www.flickr.com/photos/knolleary/6150514893/ "PCB #1 by knolleary, on Flickr") [![PCB #1](https://farm7.staticflickr.com/6198/6151065514_5271014cd8_q.jpg)](http://www.flickr.com/photos/knolleary/6151065514/ "PCB #1 by knolleary, on Flickr") [![PCB #1](https://farm7.staticflickr.com/6168/6150515181_67319c761c_q.jpg)](http://www.flickr.com/photos/knolleary/6150515181/ "PCB #1 by knolleary, on Flickr")

When they did eventually arrive, it didn't take me long to find the faults in the design. Despite my hours staring at the layout in Eagle, there were a couple things wrong. First, I realised I had missed a connection on the board layout - this was before I learnt enough about the Ratsnest tool which would have spotted the mistake. The second fault was with the custom Eagle part I had made for the LEDs  - the outline was rotated 90&deg;, putting GND somewhere it shouldn't be. I didn't spot this until I was figuring out what had caused the [LEDs to burn-out](http://www.flickr.com/photos/knolleary/6155917373/in/set-72157609950116201/) on my first fully soldered board. Thankfully both of these could be resolved without having to get another batch of boards made - a jumper wire replaces the missing connection and I need to remember to ignore the printed outline when placing the LEDs.

With these faults worked around, I had a working LED board. It only took a handful of wires and an Arduino to see it in action. Cue the video.

<div style="text-align: center;"><iframe src="http://player.vimeo.com/video/29163083" width="500" height="281" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe></div>
