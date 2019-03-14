---
layout: post
title: Google Treasure Hunt
date: 2008-05-19
tags: ["code","fun","google treasure hunt","python"]
---

Earlier today, I spotted a tweet from [@thomasj](http://twitter.com/thomasj/statuses/814757218) about the [Google Treasure Hunt](http://treasurehunt.appspot.com/). This was followed later in the day by a [series](http://twitter.com/graham_alton/statuses/814772203) [of](http://twitter.com/graham_alton/statuses/814788573) [tweets](http://twitter.com/graham_alton/statuses/814793197) from [@graham_alton](http://twitter.com/graham_alton/) (warning: spoiler in tweets!) that picqued enough interest that I decided to have a go.

In summary, the challenge is to state how many unqiue paths there are across an arbitrarily sized chessboard from the top-left corner to the bottom-right corner, but only moving down or right at each step. Graham has written up his solution, along with the original question on his [blog](http://gibbalog.blogspot.com/2008/05/google-treasure-hunt.html). 

He has gone straight for the proper solution using a simple formula... and some perl to handle the fact the numbers involved are beyond most desk calculators.

I decided to go for a bit more of a brute force approach... and some python to handle the fact I haven't touched perl in a while.

Here's my solution:

> <pre>#!/usr/bin/python> 
> # the dimensions of the board> 
> w=54> 
> h=30> 
> lr = [1]*w> 
> for y in range(1,h):> 
>    lc = 1> 
>       for x in range(1,w):> 
>          lc = lc + lr[x]> 
>          lr[x] = lc> 
> print lc</pre>

The secret here is that for any given square on the board, the number of unique paths is equal to the sum of the number of unique paths from the squares immediately to the right and below. 

Here's an attempt to express it slightly more formally:

> f(x,y) = f(x+1,y)+f(x,y+1)> 
> 
> where f(w,y) = f(x,h) = 1

The next question of the treasure hunt is due any minute now...