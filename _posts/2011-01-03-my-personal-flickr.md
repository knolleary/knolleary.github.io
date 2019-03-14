---
layout: post
title: My personal Flickr
date: 2011-01-03
tags: ["tech"]
---

The recent [Purple Screen of Death](http://techcrunch.com/2010/12/16/is-yahoo-shutting-down-del-icio-us/) unveiled an uncertain future for two of Yahoo!'s web services that I use; Delicious and Flickr.

I wouldn't call myself a heavy user of Delicious - I tend to go through periods of bookmarking everything one week, to not touching it the next. Despite their story changing from 'sun-setting' to 'selling', I'm done with Delicious and have moved over to [Pinboard](http://pinboard.in/u:knolleary).  But this post isn't about that.

[Flickr](http://www.flickr.com/photos/knolleary/) is a site I use a lot more. As the PSOD didn't even mention it, there has been a lot of speculation about its future. My first reaction was that they couldn't possibly shut the site down; it clearly has a large user base and must generate some amount of money with its Pro accounts. But I think [Jason Scott](http://ascii.textfiles.com/archives/2848) sums up the naivety of that view very nicely:

> I am, frankly, a mixture of disappointed and sad that after Yahoo! shut down Geocities, Briefcase, Content Match, Mash, RSS Advertising, Yahoo! Live, Yahoo! 360, Yahoo! Pets, Yahoo Publisher, Yahoo! Podcasts, Yahoo! Music Store, Yahoo Photos, Yahoo! Design, Yahoo Auctions, Farechase, Yahoo Kickstart, MyWeb, WebJay, Yahoo! Directory France, Yahoo! Directory Spain, Yahoo! Directory Germany, Yahoo! Directory Italy, the enterprise business division, Inktomi, SpotM, Maven Networks, Direct Media Exchange, The All Seeing Eye, Yahoo! Tech, Paid Inclusion, Brickhouse, PayDirect, SearchMonkey, and Yahoo! Go!... there are still people out there going "Well, Yahoo certainly will never shut down Flickr, because _______________" where ______ is the sound of donkeys.

Unlike Delicious, I don't plan to leave Flickr until there's a more obvious alternative. Nor am I rushing to retrieve all of my photos from the site as some people are. This is more a result of the fact I have never used Flickr to archive my photos; I have only ever uploaded the small percentage that I have wanted to share. (Although, come to think of it, there are some screenshots and non-photo images on there that I should make sure I have copies of.) But this has meant I've needed a separate strategy for backing-up my photos. 

At the moment, my strategy is to copy them to as many hard-drives as I can. My laptop is the primary store of photos, but this is my work machine, so it clearly isn't appropriate as a long term option. The Viglen box running my home automation has a meaty disk in it, so that is the first tier of backup. On top of that, I recently bought an external drive which lets me take a backup 'off-site'. So that makes three copies in my physical reach where I am sat now.

Finally, I also keep a copy in a bucket on Amazon's S3 service. This one is the most out of date because I haven't automated the uploading to it, but that's something I'll be looking at soon. At last count I have just over 9000 photos up there, dating back to 2003, with a backlog of about 4000 waiting to go up.

In the early days, I would take lots of photos and wouldn't delete anything - just in case I ever needed a blurry photo of Venice in 2005.

![](/blog/content/2011/01/blurryVenice.jpg "Blurry Venice")

How could I have possibly illustrated this blog post without that?

Needless to say, I've come to realise in the last couple of years that I need to be more ruthless and delete the chaff. Particularly as the size of each individual photo has gone from around 1Mb in the early days, up to 6Mb with my shiny new Lumix GF1 - and that's without having got to grips with RAW yet.

With all of those photos on S3, I've found myself wanting an easy way to browse through them - partly to help weed out the ones not worth keeping - as well as just making the last eight years of photos available to actually look at. Basically, I want my own personal Flickr.

A key thing here is that this wouldn't be a replacement for how I use Flickr itself - particularly the social side of it. This would be purely for my own consumption - with the ability to share photos with specific people. For example, I have taken plenty of photos of Toby that won't go onto Flickr, but I want some way of sharing them with his Grandparents and close friends.

I know things like [Gallery](http://gallery.menalto.com/) exist, which I could probably have up and running in no time. Coincidently, having just gone to the Gallery site, I see a recent [news item](http://gallery.menalto.com/node/99470) on the ability to host Gallery photos on S3. But regardless, I'm going to have a play with a roll-my-own solution.

I don't know how far I'll get, but I'll certainly post updates along the way, all in the spirit of [my plan for 2011](/2010/12/31/my-plan-for-2011/).