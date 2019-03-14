---
layout: post
title: Upgrading the MPC-L from Feisty
date: 2008-12-12
tags: ["mpc","tech","ubuntu","upgrade","viglen"]
---

_In a break from the norm, I have gone for a search friendly blog title as this is useful information that I couldn't find myself_

Currently, the Viglen MPC-L is shipped with Xubuntu 7.04 (Feisty). As of October this year, Feisty is no longer supported so any attempt to update the software results in plenty of 404 error messages like. A trawl around with google finally found [this Launchpad response](https://answers.launchpad.net/ubuntu/+question/54009).

Based on that, here are my notes for upgrading from Xubuntu 7.04 to 7.10.

1.  Check you really are on 7.04 by running:<pre>:~$ lsb_release -a</pre>
2.  Disable the screensaver. Once running, the upgrade takes an hour or so and you do not want the screensaver to activate. Both AndySC and I found we couldn't unlock the screen after the upgrade had completed overnight and the only thing to do was reboot. That said, the reboot didn't harm the upgrade, but it is better to be safe.

4.  Download the [Xubuntu 7.10 alternate CD ISO](http://www.mirrorservice.org/sites/cdimage.ubuntu.com/cdimage/xubuntu/releases/7.10/release/xubuntu-7.10-alternate-i386.iso) ([torrent](http://www.mirrorservice.org/sites/cdimage.ubuntu.com/cdimage/xubuntu/releases/7.10/release/xubuntu-7.10-alternate-i386.iso.torrent)). It may seem obvious, but make sure you get the Xubuntu CD, not the Ubuntu one. Using the Ubuntu one will fail and you'll have wasted half-an-hour downloading the ISO - I speak from personal experience.
5.  Mount the ISO locally:<pre>:~$ sudo mount -o loop \
   ~/Desktop/xubuntu-7.10-alternate-i386.iso \
   /media/cdrom0</pre>

6.  A dialog will appear prompting you to upgrade from the CD. If it doesn't appear, run:<pre>:~$ gksu "sh /cdrom/cdromupgrade"</pre>
7.  When it asks if you would like to include the latest updates from the internets, you say "No". If you say "Yes" you hit the same 404s you spent an hour trying solve before going down this path. Again, personal experience.
8.  After about a few minutes of sorting out what it needs to do it will start installing the new packages. I found it prompted me for input about 3 times early on in the ~1 hour install time and then ran to completion without further interaction - YMMV.
9.  Reboot as prompted and enjoy.

This should hopefully get you onto Gutsy, from where you can use the regular Update Manager to upgrade to Hardy and beyond.

Given the pain it is to upgrade from Feisty now, I hope Viglen will update their pre-install image soon. I'm also surprised that Ubuntu consider this an acceptable path even if Feisty is no longer supported.

_Update:_ as per [Andy's notes](http://stanford-clark.com/viglen.html), when you upgrade from Gutsy to Hardy, make sure the Universe repository is enabled, otherwise it will fail as the `xubuntu-desktop` package moved repositories between these releases.