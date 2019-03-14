---
layout: post
title: Joggler Music App
date: 2010-07-08
tags: ["tech"]
---

As a follow-up to my last post on creating Joggler applications under Linux, I thought I would share what I've been doing with it.

At some point, I plan to get all of our CD's onto the Viglen PC that's sat behind the TV. When plugged into the hi-fi, it'll make an ideal media box. It does lack one thing however; a nice UI for controlling it. This is where the Joggler can come in - and I'm not the only one to have considered it. I know others have got things like XMBC and Squeezebox running, but I wanted something that integrated better with the existing Joggler apps.

The basic idea will be to use [mpd](http://mpd.wikia.com/wiki/Music_Player_Daemon_Wiki) on the Viglen as a simple music server for which the Joggler will act as an client that sends commands to control the music playback.

The app will let us browse the music collection on there, pick an album/track, set up a playlist - all the usual things you'd expect.

Here's a video of the app as it current exists running in the emulator. You can see me browse through the music, add a Coldplay album to the playlist, start playing the list, then removing tracks from the playlist. You'll note there is no sound on this video... mostly because I've not yet done the connection to the server part; all the album/artist data is mocked up so I can develop locally.

<object width="500" height="331"><param name="allowfullscreen" value="true" /><param name="allowscriptaccess" value="always" /><param name="movie" value="http://vimeo.com/moogaloop.swf?clip_id=13189845&server=vimeo.com&show_title=1&show_byline=0&show_portrait=0&color=00ADEF&fullscreen=1" /><embed src="http://vimeo.com/moogaloop.swf?clip_id=13189845&server=vimeo.com&show_title=1&show_byline=0&show_portrait=0&color=00ADEF&fullscreen=1" type="application/x-shockwave-flash" allowfullscreen="true" allowscriptaccess="always" width="500" height="331"></embed></object>

[Joggler Music App](http://vimeo.com/13189845) from [Nicholas O&#039;Leary](http://vimeo.com/knolleary) on [Vimeo](http://vimeo.com).

Clearly there's lots still to do to make it properly usable - but it has definitely been a useful way to learn more about ActionScript.