---
layout: page
title: Ambient Orb
date: 2012-06-13
---

The [original Orb](http://knolleary.net/2008/11/25/diy-ambient-orb-redux/) was a simple thing; a BlinkM on the end of a long piece of telephone cable plugged into an Arduino, controlled by the low-powered Linux server behind my TV that's always on.

But it was largely a one-off; not something that could be packaged up as a Thing.

Since then, I've been slowly developing the idea in to a Thing. It is still a work in progress, but you can read about it in the posts below.

<ul class="post-list">
{% assign sorted = site.posts | reverse %}
{% for post in sorted %}
  {% if post.tags contains "orb" %}
  <li class="post-list-item"><a href="{{ post.url }}">{{ post.title }}<span class="post-list-date">{{ post.date | date: '%e %B %Y' }}</span></a></li>
  {% endif %}
{% endfor %}
</ul>


![](/blog/content/2012/06/orb-02.png "orb-02")
