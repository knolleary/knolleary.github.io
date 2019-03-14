---
layout: page
title: Node-RED
date: 2012-06-13
---

Here are some things I've written about [Node-RED](https://nodered.org), the
low-code event-driven application development tool I created with [Dave C-J](https://twitter.com/ceejay).

<ul class="post-list">
{% assign sorted = site.posts | reverse %}
{% for post in sorted %}
  {% if post.tags contains "node-red" %}
  <li class="post-list-item"><a href="{{ post.url }}">{{ post.title }}<span class="post-list-date">{{ post.date | date: '%e %B %Y' }}</span></a></li>
  {% endif %}
{% endfor %}
</ul>
