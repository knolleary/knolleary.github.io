---
layout: post
title: Transfering files via Bluetooth from Linux to Nokia 5800
date: 2009-05-01
tags: ["google","howto","nokia","nokia5800","obexftp","python","tech"]
---

Yes that's right - time for another google friendly post.

I've just got a [Nokia 5800](http://www.nokia.co.uk/5800) which I am loving. The fact it's my first new phone for 4 years means I've got 4 years worth of technology to catch up on. The fact the first thing I did with it was to install [python](http://wiki.forum.nokia.com/index.php/Category:Python) says a lot about me and what I plan to do with it.

Running Linux means some compromises such as not being able to run the Noika PC Suite for managing files on the phone, nor using the emulator that comes with the SDK. Some people have had varying degrees of success in running these things under Wine or VirtualBox, but I haven't found a solid set of instructions.

Putting the emulator question aside for the time being, I wanted to find out how to most easily transfer python files from the laptop to the phone. There are two main options:

1.  USB - the phone shows up as a regular storage device and just works. This is best for large transfers such as syncing music collections etc. It also gives you most freedom as to where the files end up on the phone. It isn't ideal for the edit-run-debug-edit-run-debug cycle that typifies code hacking as you have to mount/unmount each time and it's going to put unnecessary wear on the cable/ports.
2.  Bluetooth - using Gnome's bluetooth applet, as is installed with Ubuntu etc, just works... most of the time. Files sent to the phone show up as messages in your inbox and the phone will do the Right Thing depending on the file type; mp3's are added to your music store and .sis install packages are installed. It doesn't work for sending python files over however. The phone treats them as text files and adds them to the Notes application. This is annoying when they need to be copied to a particular location on the memory card for them to work.

Some further googling around has led me to obexftp - part of the [OpenOBEX](http://dev.zuckschwerdt.org/openobex/) tool set. This is a command-line tool (with gui available if you really want), that provides a quick and easy way to transfer files to and from phone. As you can specify the remote destination, it bypasses the phone's auto-handling of the file. Here's a quick run down of using it.

1.  To begin with, make sure you've got it installed.
<pre>$ sudo apt-get install obexftp</pre>

2.  Find the bluetooth address of your phone. Make sure the phone's bluetooth visibility is enabled and then run:
<pre>$ hcitool scan
Scanning ...
        00:11:22:33:44:55    MyPhone
</pre>

3.  Test the connection. When you run this command, you will get a prompt on the phone asking to accept the connection - in case it wasn't obvious, say 'yes'.
<pre>$ obexftp -b 00:11:22:33:44:55 -l
Browsing 00:11:22:33:44:55 ...
Channel: 6
Connecting...done
Receiving "(null)"... <?xml version="1.0"?>
<!DOCTYPE folder-listing SYSTEM "obex-folder-listing.dtd"
  [ <!ATTLIST folder mem-type CDATA #IMPLIED>
  <!ATTLIST folder label CDATA #IMPLIED> ]>
<folder-listing version="1.0">
   <folder name="C:" user-perm="R" mem-type="DEV" label="NOKIA"/>
   <folder name="E:" user-perm="RW" mem-type="MMC" label="Memory card"/>
</folder-listing>done
Disconnecting...done
</pre>

All being well, at this point you're all set to put and get files to your heart's content.

To put a file:
<pre>$ obexftp -b 00:11:22:33:44:55 -c "E:\\Python\\" -**p** test.py</pre>

To get a file:
<pre>$ obexftp -b 00:11:22:33:44:55 -c "E:\\Python\\" -**g** test.py</pre>

To delete a file:
<pre>$ obexftp -b 00:11:22:33:44:55 -c "E:\\Python\\" -**k** test.py</pre>

There are a few other options available that I won't bother going into because if you've read this far, you're probably capable of reading:
<pre>$ man obexftp</pre>

A couple gotchas that caught me out at first; make sure to use double-backslashes for the path separators and make sure to put a path separator at the end of the path. Not doing either of these caused the file to transfer fine, but then the phone's auto-handling kicked it.