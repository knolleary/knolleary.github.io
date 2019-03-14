---
layout: post
title: Monitoring energy use with an Orb
date: 2009-01-05
tags: ["ambient orb","arduino","currentcost","rsmb","tech"]
---

I spoke at [Homecamp](/2008/11/30/homecamp-08/) recently about how an ambient orb could be used to monitor home energy usage. I've finally gotten around to putting some of it into practice so thought I would share some of the details of the setup as well as some more of my thoughts on the subject.

There are three key pieces of hardware in use. The Viglen MPC-L is the heart of the system. As I've mentioned previously, this is a low powered linux box running Ubuntu. The CurrentCost meter is connected to the MPC over USB-serial and my trusty arduino acts as an integration point for homebrew toys - including my [ambient orb](/2008/11/25/diy-ambient-orb-redux/).

The MPC is running a [Really Small Message Broker](http://www.alphaworks.ibm.com/tech/rsmb) (RSMB). This is a small-footprint pub-sub message broker that talks MQTT. Each time the CurrentCost sends out a update, a piece of perl ("`cc_pub.pl`") parses the data, sticks it into an RRDTool database for graphing and also publishes it to the `home/cc/power` and `home/cc/temp` topics.

Another piece of perl ("`orbcontrol.pl`") is subscribed to the `house/orb` topic. When messages arrive on that topic, they are passed over serial to the arduino.

The sketch on the arduino currently listens on its serial port for commands that are then passed to the BlinkM in the orb. The format of the commands is identical to those in the BlinkMTester sketch that comes with the BlinkM. In the future this will do more as more things are attached to the arduino.

So far I have described how the orb is controlled and how the power data gets into the system. The next piece is how the two are plumbed together. Unsurprisingly, yet another perl script is running the on the MPC that provides the glue for this mixed metaphor.

`orblogic.pl` is subscribed to the `home/cc/power` topic so it receives all of the updates from the CurrentCost. It then makes a decision as to what colour the orb should be and then publishes the appropriate command to the `house/orb` topic.

![Orb setup sketch](/blog/content/2009/01/orbsetup.jpg "Orb setup sketch")

That is pretty much it - simple eh? Well, I did skip over the most interesting part - how to decide what colour the orb should be.

There are two key philosophies that come into play here:

*   Alert the unusual - have the 'default' state be the least obtrusive, such as 'off'
*   Band the data - don't react to single-point changes in the value. For example, when monitoring temperature, nothing is worse than constantly saying "its 19&deg;C, its 18&deg;C, its 19&deg;C..."
These points should be applied whenever thinking about how to turn a raw stream of data into a useful stream of information.

I currently have a very simple piece of logic controlling the orb:

*   If `power` < 400, turn the orb off
*   If `power` between 400 and 1000, turn the orb orange
*   If `power` > 1000, turn the orb red
When we're sat in the living room watching TV, we typically use under 400 watts, so the orb will only show anything if we're over this value. It is very unusual to go over 1 kw unless we're cooking, which is why that gets a stronger alert.

![powergraph sketch](/blog/content/2009/01/powergraph.jpg "powergraph sketch")

Despite its simplicity, this has already had the effect of making us more aware of when lights have been left on or when the kettle has finished boiling.

But as with all things, it could get much smarter. Having said we typically use under 400 watts watching TV, I also made the caveat 'unless we're cooking'. Given the system has a history of our power usage, it could feasibly determine suitable bands dynamically - so going over 1 kw between 6pm and 7pm isn't necessarily a bad thing. Also, it chould only go red if the value goes over 1 kw for more than the time it takes to boil the kettle.

It all comes back to determining what is 'unusual'. 