---
layout: post
title: How I got onto prime-time BBC One
date: 2010-04-22
tags: ["life"]
---

It all started, as things do, with a tweet. 

As part of the Emerging Technologies group at IBM Hursley, [Kevin](http://twitter.com/kevinxbrown) gets to play with new technologies to see how they might be useful to IBM's customers. One such item is the [Emotiv](http://www.emotiv.com/) headset (an electroencephalograph if you must), which can read signals in the brain. You can train it to recognise particular thoughts which has some very interesting applications from gaming to rehabilitative care.  You can find out more about the headset in this piece from [The Times](http://www.timesonline.co.uk/tol/news/science/eureka/article7011979.ece). But I digress.

The BBC were interested in finding out more about the headset and what sort of thing IBM had been doing with it. Knowing they were interested to see if a car could be controlled by the headset, Kevin was looking for something to make the demo more relevant, which led to his [tweet](http://twitter.com/kevinxbrown/status/5065675833).

[![](/blog/content/2010/04/kxb_twitter.png "The twitter that started it")](http://twitter.com/kevinxbrown/status/5065675833)

With only a couple days to put something together, I suggested we go down the route of wiring up an existing radio controlled car to an Arduino. Kevin already had the headset hooked up to MQTT, so it would be trivial to use my arduino MQTT library to get them all talking.

A quick trip to Asda and I was the proud owner of a £9 blue Mini Cooper car, which I attacked with my soldering iron. It didn't take much to get it working - I'll blog the finer details of that bit soon.

The demo went well and we discussed more about what they wanted to do for the programme itself. Some of their ideas were ambitious to say the least. Someone mentioned the idea of driving a bus through Whitehall... not sure how serious that was. But ultimately, a straight race between two taxis 'driven' by the two presenters was decided on.

A couple weeks later, they were back in Hursley to film with [Jem](http://www.bbc.co.uk/bang/the_team/about_jem.shtml) and [Dallas](http://www.bbc.co.uk/bang/the_team/about_dallas.shtml). Now, there are some things that are best not left to the last minute. Such as realising they needed _two_ radio controlled cars for filming - when I only had one. Luckily this dawned on me the day before they came down so I returned to Asda and got a shiny red sports car that would look good alongside the mini. I then discovered one of the reasons they were so cheap is that both worked on the same frequency... one remote drove both cars. With time running out, I went back and got a gaudy yellow jeep that was a completely different make and thankfully worked on a different frequency.

[![The cars](https://farm3.static.flickr.com/2793/4541188093_45ed1ec75c.jpg)](http://www.flickr.com/photos/knolleary/4541188093/ "The cars by knolleary, on Flickr")

A couple of weeks later, Kevin and I headed up to a barn in middle-of-nowhere-Northamptonshire where Jem had been working on the taxis. Now, a few people have said to me "yeah, but he doesn't really do the work does he?", to which I have to reply that he very much does; Jem really knows what he is talking about when it comes to building things and the enthusiasm he portrays on screen is just what he's like in real life.

[![Jem Stansfield](https://farm3.static.flickr.com/2766/4541517172_ffa4fa4b95.jpg)](http://www.flickr.com/photos/knolleary/4541517172/ "Jem Stansfield by knolleary, on Flickr")

Over the course of two freezing days, we got the radio units hooked up to MQTT, again via an arduino. This was probably the piece I was most worried about - it was one thing to hack a toy remote control but it was going to be quite another to do the same to an industrial radio set that cost considerably more. Not to mention the fact that they were also on loan for the project, so breaking them would have not made me any friends.

[![In the workshop](https://farm3.static.flickr.com/2719/4540874403_596d410cea.jpg)](http://www.flickr.com/photos/knolleary/4540874403/ "In the workshop by knolleary, on Flickr")

We filmed the first test run and the relief was palpable when the car lurched forward thanks to Jem's brain - not to mention the reaction when he managed to brake within a few inches of an oil drum. Although none of that made it into the final programme.

[![Mission Control](https://farm5.static.flickr.com/4056/4541510904_2d05d99ed6.jpg)](http://www.flickr.com/photos/knolleary/4541510904/ "Mission Control by knolleary, on Flickr")

And then we had the main event - the race itself at the [Santa Pod Raceway](http://www.santapod.co.uk/). 8am on a freezing December morning is not the best time to be trying to wire up the last few connections and try to debug why the damn thing wasn't working. But somehow we got there and eventually the taxis did what they were thought to do - even if one did plow into the crash barrier at some considerable speed.

[![Dallas & Jem](https://farm3.static.flickr.com/2765/4541518070_9200b24a85.jpg)](http://www.flickr.com/photos/knolleary/4541518070/ "Dallas & Jem by knolleary, on Flickr")

The plan had been to do two races; a straight race and an obstacle course. Technical hiccups along the way meant it wasn't until after lunch that we got the straight race filmed, at which point we were running out of light. It was decided to put Dallas in the back of a taxi and have Jem drive him around. This was the first proper test of steering by mind-control. Let's just say I wouldn't enter into a slalom race any time soon.

With all the filming done we packed up and headed home. Almost 5 months later, we got to see the end result on TV. Having spent the best part of 4 days filming, I was fascinated to see how they would edit it down to the 10 minutes or so they had to fill. I have to say I'm really please with the result. They may have given Kevin the speaking part out of the two of us, but I think I got more close ups. Given the target audience, I'm also not that surprised that they didn't dwell on the finer details of the technology.

That said, I'm a proud geek that managed to get both my Ubuntu lanyard and an Arduino onto prime-time BBC One.

[![Arduino on BBC1](https://farm3.static.flickr.com/2715/4541189407_eae2c6f247.jpg)](http://www.flickr.com/photos/knolleary/4541189407/ "Arduino on BBC1 by knolleary, on Flickr")

[![Me](https://farm3.static.flickr.com/2715/4541825724_a207da04f3.jpg)](http://www.flickr.com/photos/knolleary/4541825724/ "Me by knolleary, on Flickr")

_Update_: you can see the bits of the programme that featured the taxis [here](http://www.criticalmention.com/report/5093x135035.htm).