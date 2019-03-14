---
layout: post
title: for(laziness in javascript)
date: 2006-10-18
tags: ["code","javascript"]
---

This post is mostly a note-to-self.

Compare the following pieces of javascript:
<pre style="background: #eee; margin: 10px; padding: 2px; float: left;">
var list = ['a','b','c'];
for(x in list) {
   alert(x);
}</pre>

<pre style="background: #eee; margin: 10px; padding: 2px; float: left;">
var list = ['a','b','c'];
for(**var** x in list) {
   alert(x);
}</pre>
<div style="clear:both;">&nbsp;</div>

Either works in Firefox. Only the one on the right works in IE. Hint: the difference is in **bold**.

The IE behaviour encourages you to define your variables and not get lazy. Given that I develop under Firefox and don't test under IE until late in the day, remembering this one will be a huge time-saver.