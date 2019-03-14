---
layout: post
title: Big Red (usb) Button
date: 2011-10-04
tags: ["tech"]
---

A few weeks ago, [Ben](http://www.hardill.me.uk/wordpress/) was putting together a proof-of-concept for what turned into the [MQTT powered video wall](http://eightbar.co.uk/2011/09/16/mqtt-powered-video-wall/). He needed a button to trigger the publishing of an MQTT message. We happened to have a [Staples Easy Button](http://www.google.co.uk/search?q=staples+easy+button&tbm=isch&biw=1920&bih=968) lying around that was ripe for the hacking.

[![Big Red (usb) Button](https://farm7.static.flickr.com/6114/6212061234_3147ae706f.jpg)](http://www.flickr.com/photos/knolleary/6212061234/ "Big Red (usb) Button by knolleary, on Flickr")

A short time spent with scalpel and soldering iron and I had a pair of wires sticking out the bottom of the button that could be plugged into an arduino; which was good enough for Ben's demo. 

[![Big Red (usb) Button](https://farm7.static.flickr.com/6174/6211550625_9f47a8b4d0.jpg)](http://www.flickr.com/photos/knolleary/6211550625/ "Big Red (usb) Button by knolleary, on Flickr")

But then this week [Dale](http://dalelane.co.uk/blog/) was wanting a button to use as a part of a [Watson](http://www-03.ibm.com/innovation/us/watson/index.html) talk next week. Rather than just hand him the button, an arduino and a guide to wiring them together, I decided to be more helpful.

I knew the base of the button had some empty space once the batteries and speaker were removed and I had a spare [Freeduino Nano](http://www.nuelectronics.com/estore/index.php?main_page=product_info&cPath=1&products_id=15) awaiting a project, so it was back to the scalpel and, this time, hot glue gun.

[![Big Red (usb) Button](https://farm7.static.flickr.com/6156/6211551653_4a591523f6.jpg)](http://www.flickr.com/photos/knolleary/6211551653/ "Big Red (usb) Button by knolleary, on Flickr")

So we now have a button with a usb connection that can plug straight into a laptop to do stuff. Unlike RIG's [Big Red Button](http://designswarm.com/2011/big-red-button/) it doesn't emulate a keypress as it doesn't appear as a HID device to the laptop - I'll save that for another day.

At the moment, the sketch on the arduino simply writes 'hit' to the serial port when the button is pressed, so it needs something to run on the laptop to get the message and act accordingly. Which is trivial enough with python:

<pre>
import serial
PORT="/dev/ttyUSB0"

def buttonPressed():
 print "Do your magic here"

s = serial.Serial(port=PORT, baudrate=9600)

while True:
 l = s.readline()
 if l[:3] == 'hit':
  buttonPressed()
</pre>

[![Big Red (usb) Button](https://farm7.static.flickr.com/6160/6212065238_59b43bd9b3.jpg)](http://www.flickr.com/photos/knolleary/6212065238/ "Big Red (usb) Button by knolleary, on Flickr")