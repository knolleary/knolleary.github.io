---
layout: post
title: Selphy CP510 under Linux
date: 2006-12-10
tags: ["random","tech"]
---

_Having googled around this subject, I was surprised to see how little information was out there that could help me. This post is intended to increase the Google Juice._

I bought a Canon Selphy CP510 printer earlier in the year to replace my Canon Stylus Photo 950. The '950 was proving too expensive to run given how little photo printing I was doing and the large amount of text printing Jo was doing. (The Selphy only replaces the photo printing side of the 950; I also bought a HP Scanjet F320 which acts as a better general printer).

The Selphy is a great little portable photo printer that does almost all I want. Being able to directly attach either of our cameras is really handy. However I came across an annoying issue with it; it refuses to print an image that has been edited on the computer and put back on the camera. It simply says 'cannot print' with no further explanation. Google doesn't help much here, aside from a few reports that agree with my experience. Unfortunately I couldn't get to the bottom of the issue so I had to get the Selphy directly attached to my laptop.

The [LinuxPrinting.org](http://www.linuxprinting.org/show_printer.cgi?recnum=Canon-SELPHY-CP-510) page for this printer details the state of support; currently described as 'mostly'. The laptop is running Ubuntu Dapper which makes a lot of this easier.

The last time I tried printing to the Selphy, I added a printer to the system, selecting the Canon CP100 driver; there wasn't a CP510 driver listed as was suggested there should be. When I tried printing from EOG it failed, wasting a shot of the Selphy cartridge. Not wanting to waste more, I left it at that.

This time, I read around a bit more, and got the impression that gimp-print/gutenprint was the way to go. That meant installing some extra packages that I didn't have - an `apt-cache search` on `gutenprint` reveals a number of them.

I then fired up the [GIMP](http://gimp.org/) and loaded one of my recent photos. Under the print dialog I added a new printer called 'Selphy' and under the 'Setup Printer' dialog I selected the Print Queue of the original CP100 printer I added previously.

For the driver, I expected there to be a CP510 driver in the list having installed the new packages, but there simply wasn't. I selected the Canon CP220 driver this time, and was happy to discover that I was able to successfully print directly to the Selphy.

One last note; before printing, make sure you click 'Save Settings' - otherwise it will print and then forget all the settings you've made.