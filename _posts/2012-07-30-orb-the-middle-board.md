---
layout: post
title: Orb&#58; The Middle Board
date: 2012-07-30
tags: ["ambient orb","orb"]
---

_[ part of the [orb series](/orb/) ]_
![](/blog/content/2012/07/orb-06.png "orb-06")
A couple of years ago, I bought a [Component Bundle](http://www.oomlout.co.uk/component-bundle-for-arduino-compatible-arcb-p-227.html) from oomlout - a kit of parts to build your own Arduino-compatible board. This proved to be a great lesson in what an Arduino actually is and how it can ultimately boil down to a small handful of components.

As with the other boards, the Eagle files are on [github](https://github.com/knolleary/multi-channel-orb/tree/master/pcb/orbB). I've also included pngs of both the schematic and board for those without Eagle.

<div style="text-align: center; clear: both;">![](https://github.com/knolleary/multi-channel-orb/raw/master/pcb/orbB/orbB-sch.png)</div>

Here's a quick run through of that handful of components. `C1`, `C2` and the 16MHz Crystal keep the ATmega328 at the heart of the board ticking. `C3` is a smoothing capacitor between `Vcc` and `GND`. `C4` smooths the reset line from the FTDI header - in comparing various Arduino-clone schematics, I couldn't find a consensus on whether it's actually needed. As it's easier to solder a jumper across unused gaps than it is to retro-fit an additional component, I decided to play safe and added it in. Finally, `R1` and the switch allow the board to be manually reset.

<div style="text-align: center; clear: both;">[![Eagling](https://farm8.staticflickr.com/7160/6654877927_8df62aff1b_n.jpg)](http://www.flickr.com/photos/knolleary/6654877927/ "Eagling by knolleary, on Flickr")</div>

Laying this board out in Eagle was when I discovered how addictive it can be manually routing all of the connections. There's an art in making the mess of connections aesthetically pleasing; completely pointless for the functionality of the board, but satisfying to get just so. I also discovered how to add a ground plane to the board - making the bottom layer much easier to layout.

<div style="text-align: center; clear: both;">[![PCB #2](https://farm7.staticflickr.com/6093/6215251000_afdf780a38_q.jpg)](http://www.flickr.com/photos/knolleary/6215251000/ "PCB #2 by knolleary, on Flickr") [![PCB #2 - half built](https://farm7.staticflickr.com/6106/6215250044_17ba9085e8_q.jpg)](http://www.flickr.com/photos/knolleary/6215250044/ "PCB #2 - half built by knolleary, on Flickr") [![PCBs #1 & #2](https://farm7.staticflickr.com/6177/6215248986_98aa2b07f1_q.jpg)](http://www.flickr.com/photos/knolleary/6215248986/ "PCBs #1 & #2 by knolleary, on Flickr")</div>

After another three-week wait, the boards arrived and the first soldered together. Thankfully, the lessons learnt with the LED boards, and the hours spent making minute tweaks to the layout meant it worked first time. Which, in hindsight, was very pleasing as I hadn't actually verified the circuit on a breadboard and had going straight into production with a theoretical circuit.