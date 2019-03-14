---
layout: post
title: A-Mazing Little Printer
date: 2013-01-15
tags: ["tech"]
---

I made a thing. I wanted to make lots of things last year, but didn't. That made me sad. It being a new year and all, it felt like a good time to start making.

Last summer, I was fortunate enough to be invited to BERG's [Little Printer Hack Day](http://bergcloud.com/2012/07/02/little-printer-hack-day/). I went along with not only all sorts of ideas to play with but also a migraine and ongoing waves of nausea through-out the day. Which wasn't ideal. Despite that, it was a fun day and having managed to not pass out, I worked with [Kass](https://twitter.com/kassschmitt) to make the [ASCII Meterogram](http://www.flickr.com/photos/knolleary/7473137758/in/photostream/) - a weather report from the Norwegian Meterological Institute and NRK.

A couple weeks ago, whilst contemplating doing a write-up of the year I stumbled over the code from the hack day and decided I ought to do something with it. Later the same day, for reasons I don't recall, I found myself falling down the rabbit-hole of [Maze generation algorithms](http://en.wikipedia.org/wiki/Maze_generation_algorithm) on Wikipedia.

![](/blog/content/2013/01/maze.jpg)  

photo courtesy of [Alice @ BERG](http://berglondon.com/studio/alice-bartlett/)

Not long later, I had a Little Printer publication that serves up a new random maze every day. There isn't much to it really - just your standard [recursive backtracker](http://en.wikipedia.org/wiki/Maze_generation_algorithm#Recursive_backtracker) algorithm in a few lines of javascript. As you do.

The code's up on [GitHub](https://github.com/knolleary/amazing). It's a Django app, so if that's your thing, feel free to have a play. Otherwise, have a look at the [sample](http://kahiti.knolleary.net/amazing/sample), or subscribe your own Little Printer through the [BERG Cloud remote](http://remote.bergcloud.com/).

It feels good to make a thing. To make a thing, ship it and see, as of the moment I'm writing this, 30 people subscribed to receive a daily piece of the thing.

More making this year. More bad puns in blog post titles.
