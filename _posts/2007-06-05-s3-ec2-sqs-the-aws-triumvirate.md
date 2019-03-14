---
layout: post
title: S3, EC2, SQS - The AWS Triumvirate
date: 2007-06-05
tags: ["tech"]
---

![Amazon Web Services](/blog/content/2007/06/aws.gif)

The Amazon Web Services have been on my radar for a while now, but a recent talk at Hursley by [Jeff Barr](http://www.jeff-barr.com/) renewed my resolve to have a play. Jeff works in Amazon's Web Services Evangelism team and if there is one thing Jeff does well, it's evangelism. I left his talk impressed by how they are delivering the on-demand vision for web services that IBM has talked about for so long.

They offer a global storage architecture with S3, scalable computing capacity with EC2 and web-scale messaging with SQS. This full house of web services gives you most of what you want to build highly scalable systems without having to invest in hardware. Jeff cited an example of a podcasting site, whose name I forget, that managed to get their IT infrastructure in place for $100 in one week. They have no hardware costs, no maintenance, no 2am wake-ups when a hard-disk fails.

Whilst I don't currently have a need for a scalable-web-architecture of my own, I have been looking at the storage side of things to provide some remote backup to my photo collection. At the moment they are dotted across various machines with little backup or redundancy.  I had considered getting a [NSLU2](http://en.wikipedia.org/wiki/NSLU2) with some disks attached, but whilst I don't rule out this option for the future, with a house move imminent I decided the time was right for an off-site solution.

The one sticky issue with S3 is that you can't just use it; Amazon provide an API but you have to rely on third-party applications to make use of it. Here is where my fun began.

The first tool I looked at was the ruby-based s3sync. Following some instructions google found for me on [John Eberly's](http://blog.eberly.org/2006/10/09/how-automate-your-backup-to-amazon-s3-using-s3sync/) blog, I set about creating a storage bucket and began uploading the 1.5Gb of photos from my main server. Unfortunately, this server runs an old version of debian which, as it's also my TV, is not about to be updated. This left me with the wrong version of ruby, so I moved to the python based tools provided by [Hanzo](http://www.hanzoarchives.com/development-projects/s3-tools/). Besides, I'm more a python guy these days.

After a couple hours of uploading, I decided to play some more with the API; I wanted to see how to change the permissions of the files so that I could share them publicly. After reading more of the documentation, it appeared that the only way to do this is via the REST or SOAP APIs. I soon found another python library to try - this time one available on the Amazon site itself - that would do the job. However, every attempt I made failed as it couldn't find the bucket I had created. Getting quite frustrated with it I eventually found the problem; to access a bucket via HTTP, the it's name needs to be all lowercase - which was not the case with the bucket I had created. Given the inability to rename an existing bucket, I stopped uploading, deleted the bucket and started again.

That mistake cost me about $0.10. Not exactly the end of the world.

24 hours, 1 internet outage and $0.34 later, 1800 photos and a handful of videos from April 2003 to August 2005 are now safely stored and accessible from anywhere with an internet connection.

Just another 4000 to go - once I get them copied off the various laptops.
