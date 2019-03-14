---
layout: post
title: Overlapping Text
date: 2006-09-06
tags: ["code","css","tech","text"]
---

The parent hosting site for knolleary is [BlogsDollocks](http://www.blogsdollocks.com) - a hosting service that I have a hand in.

Last night I spent some time reworking the BD homepage so that it includes a selection of blog entries from the hosted sites. This was easily achieved using the same [mechanism](/2006/08/30/changing-dates/) as I used for the del.icio.us links in the sidebar.

One of the existing design features of the page that [Kyb](http://kybernetikos.com/) put together was the BD text at the top of the page. On my laptop, running Ubuntu Dapper with Firefox 1.5.0.5, it looks like this:

![BlogsDollocks Logo on Laptop](/blog/content/2006/09/bds_logo_2.gif)

I was never quite sure about this overlapping design, but it wasn't until this morning that I looked at the site with my desktop machine, running Debian with Firefox 1.0.4 that I saw it rendered like this:

![BlogsDollocks Logo](/blog/content/2006/09/bds_logo_1.gif)

This does lead me to wonder which is the correct rendering of the text.

The html for the logo is simply:
<pre><div class="title">
   <h1>Blogs Dollocks</h1>
   <h2>every blog has his day</h2>
</div></pre>

and the css is:

<pre>
div.title {
        font-size: 28pt;
        width: 6em;
        margin: auto;
}
h1 {
        font-family: perpetua, serif;
        font-weight: normal;
        font-size: 28pt;
        text-align: center;
        line-height: 0px;
        padding-top: 20px;
}

h2 {
        font-style: italic;
        font-weight: normal;
        font-size: 7pt;
        text-align: right;
        line-height: 0px;
}
</pre>

It seems that the `width` property of `div.title` is what is being handled differently. It all comes down to the magical `em` unit of measurement.

The differing versions of firefox is a complete red herring. The key is the different resolutions the two machines run at - the laptop at a lowly 1024x768 and the desktop at 1600x1200.

If I set the `width` to a more rigid value of `200px` then the text is rendered more consistently between the two browsers - in this case with the words overlapping as `200px` is not sufficient for the text to be layed out fully at its default font size. However this doesn't work with zooming the page (Ctrl++/Ctrl+- on firefox).

Having conferred with Kyb, the desired rendering is the properly spaced out version. As such, I have changed to css to:
<pre>
div.title {
        font-size: 8em;
        width: 3em;
        margin-left: 200px;
}
</pre>

This keeps the text looking sane at both resolutions, and gracefully handles enlarging the text.

Note I have also moved away from `margin: auto` so that the title stays in position as the screen size changes.
