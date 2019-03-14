---
layout: page
title: JavaScript Games
---

<ul class="post-list">
{% assign sorted = site.posts | reverse %}
{% for post in sorted %}
  {% if post.tags contains "games" %}
  <li class="post-list-item"><a href="{{ post.url }}">{{ post.title }}<span class="post-list-date">{{ post.date | date: '%e %B %Y' }}</span></a></li>
  {% endif %}
{% endfor %}
</ul>
