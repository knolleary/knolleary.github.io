---
layout: post
title: Changing dates
date: 2006-08-30
tags: ["delicious","tech"]
---

Being the tinkerer that I am, rather than use one of the available [del.icio.us](http://del.icio.us) plugins for Wordpress, I decided to write my own; the result of which you can see over in the sidebar - unless of course you are reading this via one of the feeds.

There is a simple php script sat on knolleary.net that uses [MagpieRSS](http://magpierss.sourceforge.net/) to fetch and cache the feed for my del.icio.us bookmarks. When a page of the site is loaded, a little bit of javascript sends an async request to the script to fetch the html for the bookmarks. This prevents any slowness in fetching the feed from impacting the page load time.

The principle of it works very nicely, however there appears to be an issue with it; on occasion it gets the 5 most recent entries wrong - not randomly wrong, but consistently the wrong 5 entries are shown.

Having spent some time looking at this, I have found the problem - MagpieRSS uses the `<dc:date>` field of the feed to determine the order of the items. For a selection of the items in the feed, the correct values are:
<pre>
GStreamer  : 2006-08-29T08:22:15Z
MVC        : 2006-05-16T20:16:00Z
Cheat      : 2006-05-07T11:48:41Z
Dojo       : 2006-05-24T13:21:15Z
Styles     : 2006-04-22T10:25:02Z
</pre>
and the rss feed agrees - most of the time. However, it ocassionally gets the date field wrong, as you can see for the same selection of items taken from a feed fetched seconds after the previous one:
<pre>
Styles     : 2006-08-29T14:00:00Z
MVC        : 2006-08-29T14:00:00Z
Cheat      : 2006-08-29T14:00:00Z
Dojo       : 2006-08-29T14:00:00Z
GStreamer  : 2006-08-29T11:13:20Z
</pre>

Its clear that there is a problem with the del.icio.us feed. I have emailed their support reporting the issue - hopefully it'll get resolved soon.

For now, enjoy the (pseudo-random) del.icio.us links.

_Update_:

I was slightly skeptical of the potentially nebulous means of the reporting the issue to del.icio.us. via email to a generic support address. However, I can happily report that it took all of 30 minutes to get a reply. No fix yet, but will look at it soon - apparently today is pretty busy... I wonder what is about to emerge ;)