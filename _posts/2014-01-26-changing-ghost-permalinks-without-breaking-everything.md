---
layout: post
title: Changing Ghost permalinks without breaking everything
date: 2014-01-26
tags: ["code"]
---

I'm a big fan of the [Ghost blogging platform](https://ghost.org/). Having heard [Hannah Wolfe](https://twitter.com/ErisDS) talk about it a couple of times, I was keen to try it out. In fact I purposefully held off setting up a blog for [Node-RED](http://nodered.org) until Ghost was available.

It was painless to set up and get running on my Web Faction hosted server - even though at that point Web Faction hadn't created their one-click installer for it.

Ghost released their second stable version a couple weeks ago, which added, amongst many other new features, the ability for a post's url to contain its date. This was a feature I hadn't realised I was missing until I wrote a post on the blog called 'Community News'. The intent was this would be a commonly used blog title as we post things we find people doing with Node-RED. However, without a date in the post, the urls would end up being `.../community-news-1`, `.../community-new-2` .. etc. Perfectly functional, but not to my taste.

So I clicked to enable dated permalinks on the blog, and promptly found I had broken all of the existing post urls. I had half-hoped that on enabling the option, any already-published posts would not be affected - but that wasn't the case; they all changed.

To fix this, I needed a way to redirect anyone going to one of the old urls to the corresponding new one. I don't have access to the proxy running in front of my web host, so that wasn't an option.

Instead, I added a bit of code to my installation of Ghost that deals with it.

In the top level directory of Ghost is a file called `index.js`. This is what gets invoked to run the platform and is itself a very simple file:

<pre>
var ghost = require('./core');

ghost();
</pre>

What this doesn't reveal is that the call to `ghost()` accepts an argument of an instance of [express](http://expressjs.com), the web application framework that Ghost uses. This allows you to pass in an instance of Express that you've tweaked for your own needs - such as one that knows about the old urls and what they should redirect to:

<pre>
var ghost = require('./core');
var express = require("express");

var app = express();

ghost(app);

var redirects = express();

var urlMap = [
   {from:'/version-0-2-0-released/', to:'/2013/10/16/version-0-2-0-released/'},
   {from:'/internet-of-things-messaging-hangout/', to:'/2013/10/21/internet-of-things-messaging-hangout/'},
   {from:'/version-0-3-0-released/', to:'/2013/10/31/version-0-3-0-released/'},
   {from:'/version-0-4-0-released/', to:'/2013/11/14/version-0-4-0-released/'},
   {from:'/version-0-5-0-released/', to:'/2013/12/21/version-0-5-0-released/'},
   {from:'/community-news-14012014/', to:'/2014/01/22/community-news/'}
];

for (var i=0; i<urlMap.length; i+=1) {
   var to = urlMap[i].to;
   redirects.all(urlMap[i].from,function(req,res) {
      res.redirect(301,to);
   });
}

app.use(redirects);
</pre>

It's all a bit hard-coded and I don't know how compatible this will be with future releases of Ghost, but at least it keeps the old urls alive. After all, [cool uris don't change](http://www.w3.org/Provider/Style/URI.html).