---
layout: post
title: Processing the Theme
date: 2011-04-06
tags: ["blog","code","processing","theme"]
---

I often spend time tweaking the theme of this site rather than write content for it, but I thought the latest tweak was worth a few words of mention.

I have tried to keep the theme quite clean - with all of the traditional sidebar content pushed right down at the bottom of the page. Previously, there was a simple division between the bottom content and the rest of the page; nothing more than a `border-top` CSS declaration:

![](/blog/content/2011/04/kss01.png "knolleary screenshot")

Inspired by the new look [Planet GNOME](http://planet.gnome.org/), I wanted to do something a bit more interesting down there - some sort of ragged edge, but I didn't want to spend an age trying to draw it by hand.

![](/blog/content/2011/04/gnomess.png "Planet GNOME screenshot")

Coincidentally, earlier today I was looking for an excuse to play with [Processing](http://processing.org) and this seemed like just the thing. I very quickly got something producing a very regular pattern:

![](/blog/content/2011/04/edge000.png "edge001")

But that felt too boring - it needed some randomness.

![](/blog/content/2011/04/edge001.png "edge001")

![](/blog/content/2011/04/edge002.png "edge002")

These were way too severe. To emulate the grass-like effect, I moved to using curves, rather than straight lines.

![](/blog/content/2011/04/edge004.png "edge004")

![](/blog/content/2011/04/edge005.png "edge005")

After a couple attemps where I didn't have my Bezier control points under control, I finally hit upon something I liked:

![](/blog/content/2011/04/edge003.png "edge003")

And that's what you'll find at the bottom of page. The nice thing with this approach is that I can easily tweak the script to produce variations and I don't have to start from scratch each time.

For the record - and so I can find it when I want to tweak it - here's the processing sketch that produced the final result:

_update_: stuck the code in a [gist on github](https://gist.github.com/1894726)

<pre>void setup() {
  size(2000,50);
  background(240);
  smooth();
  strokeJoin(ROUND);
  stroke(255);
  fill(255);
  rect(0,0,2000,40);
  stroke(153);
  fill(240);
  beginShape();
  vertex(0,42);
  int x = 0;
  for (int i=0;i<200;i++) {
    int y = (int)random(15,30);
    bezierVertex(x,37,
                 x,30,
                 x+random(-4,4),y);

    bezierVertex(x+2,30,
                 x+2,37,
                 x+random(8,9),40);

    x+=10;
    int w = (int)random(5,15);
    bezierVertex(x+(w/3),42,
                 x+(2*w/3),42,
                 x+w,40);
    x += w;
  }
  vertex(2000,42);
  endShape();

  save("footerGrass.png");
}</pre>