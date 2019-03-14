---
layout: post
title: Overflowing Quirks
date: 2006-10-16
tags: ["code","css"]
---

Much has been written about the inconsistencies of CSS within the various browsers. A great resource for learning about them is the [QuirksMode](http://www.quirksmode.org/) website. Despite having read a lot of that site, I spent far too much time today trying to debug one.

Its worth mentioning upfront that this is with Firefox 1.5.0.7 on my laptop. Since writing up this post, I have found that Firefox 1.0.x on my desktop does not behave as described here. I'm not sure which is infact 'correct'.

For a website I'm developing in work, I have a drag-and-drop interface that allows the user to arrange objects represented as `<div>` elements onscreen. If the user cancels the drag, the `<div>` is animated returning to its original position. For reasons that are not important, the `<div>` can return to one of two containing `<div>` elements. This all works well, apart from the fact that for one of the containers, an object that is returning to it consistently ends up 1 pixel out of position.

I initially assumed this was to do with the [Box model](http://www.quirksmode.org/css/box.html) issues, but the css for the two containers have identical `border` declarations. A bit of further digging and I found the only difference was the `overflow` style - and funnily enough, thats exactly where the problem lies.

To demonstrate, below are two identical `<div>` elements that contain a child `<div>` which has `position: relative` and is offset by `5px` on both `top:` and `left:`. The sole difference between them is the first has `overflow: hidden`, and the second `overflow: visible`. Each of the inner `<div>`s are armed with the following piece of javascript:
<pre>onclick="
   var a=this.parentNode;
   this.innerHTML = 'dx:'+(this.offsetLeft-a.offsetLeft)+
                    ' dy:'+(this.offsetTop-a.offsetTop);
"</pre>
When you click on them, the offset between the child and its parent is shown. Remember that the css is identical for these examples in all but `overflow`.

<div id="outer_one" class="outer" style="overflow: hidden;"><div onclick="var a=this.parentNode;  this.innerHTML = 'dx:'+(this.offsetLeft-a.offsetLeft)+' dy:'+(this.offsetTop-a.offsetTop);" id="inner_one" class="inner">click me</div></div>

<div id="outer_two" class="outer"><div onclick="var a=this.parentNode; this.innerHTML = 'dx:'+(this.offsetLeft-a.offsetLeft)+' dy:'+(this.offsetTop-a.offsetTop);"  id="inner_two" class="inner">click me</div></div>

As you can see, assuming you have clicked away and your are running the right level of the right browser, the offsets are different and its all thanks to the `overflow`. I have not fully investigated the various fixes for CSS issues such as [Strict mode](http://www.quirksmode.org/css/quirksmode.html), but I was fortunately able to code a workaround using javascript that dynamically alters the `overflow` style depending on whether the user is dragging. I admit its not the cleanest solution.

<style>div.outer {  margin-bottom: 30px; display: block; width: 150px; height: 50px; border: 1px solid #000; background: #eee; } div.inner { position: relative; top: 5px; left: 5px; background: #fee; width: 150px; height: 50px; border: 1px solid #000; cursor: pointer;}</style>