---
layout: post
title: Turning an Arduino into a Tweetject
date: 2008-04-24
tags: ["arduino","blogjects","life","mqtt","tcp","tech","tweetjects","wireshark"]
---

 A couple weeks ago I bought an [Ethernet shield](http://www.nuelectronics.com/estore/index.php?main_page=product_info&products_id=4) for my [arduino](http://www.arduino.cc) with a plan to get it connecting to the world directly. The stripped down TCP implementation that comes with it is much more geared towards making the board act as a web-server rather than client. This means you have to poll for information rather than have the arduino send it out. Unfortunately, it is this second case that I am most interested in.

Julian Bleecker's paper ["Why Things Matter"](http://www.nearfuturelaboratory.com/2006/02/26/a-manifesto-for-networked-objects/) introduced the term "blogjects" - objects that blog. A natural extension of which are "tweetjects" - objects that twitter. A good example being [Tower Bridge](http://twitter.com/towerbridge) which twitters whenever the bridge opens or closes and announces which ship is passing by. (Roo has written more on this stuff [here](http://rooreynolds.com/2008/04/24/blogjects-and-tweetjects/).)

I see an ethernet-enabled arduino as a perfect platform for building such objects from. But to do this, it needs to establish the outgoing connection itself. 

There is [another](http://ladyada.net/make/eshield/index.html) shield that provides a much more powerful option based on the Lantronix XPort ethernet hardware. It even has a [demo sketch](http://ladyada.net/make/eshield/twittersend.pde) that will post to twitter. The advantage of this shield is that it provides a serial interface to run the connection - putting much less strain on the arduino. However, this power comes at a cost - the XPort itself is around $50, whereas the Nuelectronics shield is £12.99 already assembled.

So for now, I am persevering with the cheaper board and have been learning far more about TCP packets than I ever thought necessary. So far, I have got my board doing an ARP request to map IP to MAC address, establishing a TCP connection and then sending a single blob of data (naturally, "HELLO WORLD"). This is all a couple layers lower down in the [OSI model](http://en.wikipedia.org/wiki/OSI_model) than I am used to working with in my day job.

It is still a bit too hard-coded to be easily reused and attempts to re-factor what I've done has broken it all; so I still have lots to do.

One thing I have discovered whilst playing with this all is [Wireshark](http://www.wireshark.org/) - a superb tool for sniffing packets on the network and examining their content. This has helped a lot in working out which bits and bytes are going awry in my packets.

DIY and decorating allowing, I hope to make progress on this over the next couple weeks.