---
layout: post
title: Wiring the Internet of Things - ThingMonk talk
date: 2013-12-05
tags: ["events","node-red","presentation","thingmonk","talks"]
---

_I spoke this week at the ThingMonk conference. Unlike other talks I've given, I actually wrote this one down, rather than my normal approach of throwing some slides together at the last minute._

_That has the added benefit of giving me a coherent(ish) written version I can post here. Below is the talk as I roughly planned it, albeit certainly not a word-for-word record of what I actually said._

<iframe width="560" height="315" src="https://www.youtube.com/embed/zUoCJb0jzuo" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>


* * *



[![node-red-thingmonk-slide-00](/blog/content/2013/12/node-red-thingmonk-slide-00-300x230.png)](http://knolleary.net/talks/node-red-thingmonk/#/title)

[![node-red-thingmonk-slide-01](/blog/content/2013/12/node-red-thingmonk-slide-01-300x230.png)](http://knolleary.net/talks/node-red-thingmonk/#/iowmap)

Andy Stanford-Clark, inventor of MQTT, sat here with us today, lives on the Isle of Wight, the south coast of the Isle of Wight.

The nature of his job means he has to head to London for meetings fairly regularly. Getting to London from the South cost of the Isle of Wight in time for a morning meeting is no mean feat. To catch the 7.30 train from Southampton, he has to catch the 6.45am ferry from Cowes, for which he has leave home at 6am to catch.

On one particular morning, he left home in the early morning sunshine, to arrived at the ferry port in a thick blanket of fog. And the ferries frequently get delayed in the fog.

Helpfully, there was a phone line you could call to find out if the ferries were sailing. A helpful answering machine message telling you the state of play. Unfortunately, the guy who updates the message doesn't arrive until 9, so it still said the ferries were running fine.

Sat in his car, with the extra hour in bed he could have had on his mind, Andy did what he often does and started thinking.

Surely there must be someway to know if the ferries are sailing.

[![node-red-thingmonk-slide-02](/blog/content/2013/12/node-red-thingmonk-slide-02-300x230.png)](http://knolleary.net/talks/node-red-thingmonk/#/aismap)

Firing up his laptop, plugging in his 3G modem, he soon found this site  - which shows, in realtime, all of the boats sailing in the Solent. This is based on the [AIS] radio transponders they all carry that broadcast their GPS position and identification.

Being a frequent user of the Isle of Wight ferries, Andy was soon able to pick out all of the ferries he used and started scraping their position.

A few lines of Perl later - even great minds have their flaws - and he had created a geofence - a virtual boundary - around the Cowes and Southampton ferry terminals. So whenever a ferry arrived or left a terminal, he could get a notification.

[![node-red-thingmonk-slide-03](/blog/content/2013/12/node-red-thingmonk-slide-03-300x230.png)](http://knolleary.net/talks/node-red-thingmonk/#/rftw)

The obvious next step was to give each of the ferries their own Twitter account - allowing the ferries to tweet what they were doing.

So a quick glance at his twitter stream would tell him if the ferries were sailing as expected - and give him back his hour in bed if they weren't.

As is often the case with innovation, Andy, sat there in the fog-bound car park in Cowes solved a problem personal to him and in doing so, created a Thing of use to a wider audience. So much so that, a few months later, looking at the Red Funnel website to check times for a friend he spotted a new section of the page listing the live arrival and departure times of each ferry.

[![node-red-thingmonk-slide-04](/blog/content/2013/12/node-red-thingmonk-slide-04-300x230.png)](http://knolleary.net/talks/node-red-thingmonk/#/rfws)

Curious, he clicked through and it took him to the Twitter accounts he had set up - some one at Red Funnel had found what he'd done and rather than get him to shut it down, integrated it into their own site.

Now, Andy being Andy, and it being April 1st that he spotted this, he logged into one of the accounts and sent a ferry to land-locked Milton Keynes.

[![node-red-thingmonk-slide-05](/blog/content/2013/12/node-red-thingmonk-slide-05-300x230.png)](http://knolleary.net/talks/node-red-thingmonk/#/rfwsmk)

A short while, and a couple phone conversations, later, Red Funnel formally adopted the system; 'get into Social Media' had been on their todo list for ages, but they hadn't figured out what to do.

* * *

[![node-red-thingmonk-slide-06](/blog/content/2013/12/node-red-thingmonk-slide-06-300x230.png)](http://knolleary.net/talks/node-red-thingmonk/#/iot)

[![node-red-thingmonk-slide-07](/blog/content/2013/12/node-red-thingmonk-slide-07-300x230.png)](http://knolleary.net/talks/node-red-thingmonk/#/twitter)

The Internet of Things is not a single amorphous blob that you can stick a label on. Everyone has their own definition or angle on the subject.

What I find fascinating is when an individual is able to bring together different sources of data or events and combine them in some new way. To create a new system or emergent behaviour that wasn't part of the original intent.

The AIS transponders are there for maritime safety, but now, indirectly, allow Red Funnel to provide a service they didn't know they could.

* * *

[![node-red-thingmonk-slide-08](/blog/content/2013/12/node-red-thingmonk-slide-08-300x230.png)](http://knolleary.net/talks/node-red-thingmonk/#/apple)

As a long time Linux user I have a physical fight with every projector I have to plug into my laptop. It also means I have a tendency to see any new connected device as something of a challenge; will it work with my laptop - or does it depend on an iPhone app to do anything interesting.

From a consumer point of view, the Apple Store iPhone Accessories category is full of high end, beautifully designed connected devices. And that's how IoT is beginning to enter many people's lives on a more concious level, albeit at the premium that the Apple experience elicits.

But how open are any of these devices for them to used beyond the purposes they were designed.

[![node-red-thingmonk-slide-09](/blog/content/2013/12/node-red-thingmonk-slide-09-300x230.png)](http://knolleary.net/talks/node-red-thingmonk/#/nest)

Take for example, as I'm sure will have been invoked already, the NEST thermostat, and their recently announced Smoke & Co2 detector. Taking one of the more mundane, invisible pieces of electronics in the home, to be a fully connected, intelligent device. On one side, I'm fascinated by what it takes to produce appealing connected devices. On the other, I want to know how much can I tinker with it.

So far, the Nest is a complete black box - albeit a round, shiny black box. But, they have announced a developer API to come in the New Year.

[![node-red-thingmonk-slide-10](/blog/content/2013/12/node-red-thingmonk-slide-10-300x230.png)](http://knolleary.net/talks/node-red-thingmonk/#/wemo)

By comparision, are the WeMo sockets - the remote controllable sockets made by Belkin. They don't have a formal api, but the developer community has found ways in and there are open-source libraries out there already for them.

[![node-red-thingmonk-slide-11](/blog/content/2013/12/node-red-thingmonk-slide-11-300x230.png)](http://knolleary.net/talks/node-red-thingmonk/#/wemo-quote)

But of course have announced for the robustness and security of their system, they may have to 'secure' the open protocols that are being used.

* * *

[![node-red-thingmonk-slide-12](/blog/content/2013/12/node-red-thingmonk-slide-12-300x230.png)](http://knolleary.net/talks/node-red-thingmonk/#/nodejs)

The common theme here is how you can empower the individual developer to do something interesting. Open APIs and standards-based protocols - something I'm sure Ian will talk about later today.

One of the way that openess manifests itself is within the node.js ecosystem.

[![node-red-thingmonk-slide-13](/blog/content/2013/12/node-red-thingmonk-slide-13-300x230.png)](http://knolleary.net/talks/node-red-thingmonk/#/npm)

One of the many strengths of Node.js, the server-side JavaScript environment, is the NPM repository. This is a repository of almost 50,000 modules that have been created by developers around the world to add all sorts of pieces of functionality into the environment.

[![node-red-thingmonk-slide-14](/blog/content/2013/12/node-red-thingmonk-slide-14-300x230.png)](http://knolleary.net/talks/node-red-thingmonk/#/npm-wemo)

A quick search in the repository finds at least 3 different modules written to control WeMo sockets, there's even one for the NEST to query basic information from the Thermostat.

Whatever the device, as time passes, the probability of there being at a relevant module within NPM increases to 1.

This can pose its own challenges - there is no arbiter of quality to get a module into the repository; of those three Wemo modules, two of them are still version 0.0.2 and seem to have been orphaned off - so you do have to take some care picking the right modules to use.

* * *

[![node-red-thingmonk-slide-15](/blog/content/2013/12/node-red-thingmonk-slide-15-300x230.png)](http://knolleary.net/talks/node-red-thingmonk/#/pi)

The days of hardware hacking being the preserve of the highly skilled have long since gone.

The arduino, mbed, beaglebone black all exist to make it easier for anyone to start wiring things together; to cross the physical/digital divide and make Things.

When you look at the NEST as the current pinacle of connected thermostats, you also have to consider things like this:

[![node-red-thingmonk-slide-16](/blog/content/2013/12/node-red-thingmonk-slide-16-300x230.png)](http://knolleary.net/talks/node-red-thingmonk/#/thermtweet)

> Built an 'annoying home thermometer' that plays Arduino 'Twinkle Twinkle Little Star' example on loop while room temp is above 25 degrees.>
>  @danlockton - https://twitter.com/danlockton/status/392422819297894400

It's that freedom to play, to create something that joins A & B, to experiment with what works for you as an individual.

[![node-red-thingmonk-slide-17](/blog/content/2013/12/node-red-thingmonk-slide-17-300x230.png)](http://knolleary.net/talks/node-red-thingmonk/#/bikemaps)

As part of the Homesense research project, Russell Davies, along with Tom Taylor who spoke earlier, created this bike map. Centred on his flat in London, it has LEDs at each of the local Boris bike stations. Whenever there are more than 5 bikes available at a particular station, the light comes on. It means when he leaves in the morning, with a simple glance he knows whether to turn left or right to find the nearest available bike. There's no screen here, no mobile app, no intrusive notification. A quick glance and he's on his way.

The ability for individuals to create things for themselves; to solve problems personal to them.

[![node-red-thingmonk-slide-18](/blog/content/2013/12/node-red-thingmonk-slide-18-300x230.png)](http://knolleary.net/talks/node-red-thingmonk/#/bubblino)

This is Bubblino - Adrian McEwens connected bubble machine that spews out bubbles when people mention it on twitter. Silly, delightful, playful.

[![node-red-thingmonk-slide-19](/blog/content/2013/12/node-red-thingmonk-slide-19-300x230.png)](http://knolleary.net/talks/node-red-thingmonk/#/got)

A couple years ago, Andy Huntingdon, called this stage of IoT as the Geocities of Things. Geocities being that early space on the internet where may people cut their teeth in creating X-Files fan pages or unwiting tributes to the creator of the animated under-construction gif.

It was a space you could create webpages without really knowing what you were doing. Clay Shirky famously thought sites like Geocities would never take off, but later came to realise that:

[![node-red-thingmonk-slide-20](/blog/content/2013/12/node-red-thingmonk-slide-20-300x230.png)](http://knolleary.net/talks/node-red-thingmonk/#/clayquote)

> Creating something personal, even of moderate quality, has a different kind of appeal than consuming something made by others, even something of high quality.

Geocities allowed people to play, to experiement. To create sites that were beautiful in their eyes - if not anyone elses. It's where a generation learnt the art, or otherwise, of web design.

And with IoT today, there is an explosion in platforms, products and protocols that help solve some of the underlying hard technical challenges and provide a space for people to play.

[![node-red-thingmonk-slide-21](/blog/content/2013/12/node-red-thingmonk-slide-21-300x230.png)](http://knolleary.net/talks/node-red-thingmonk/#/tclandspace)

But that explosion brings its own challenges. Each platform has its own set of apis. Each protocol has its own set of clients and servers to learn about. Every technology that makes something easier to do, brings another choice that a developer has to make.

Just like the WeMo node.js modules I mentioned.

There is never going to be a single, one-size-fits-all solution. Nor should there be.

[![node-red-thingmonk-slide-22](/blog/content/2013/12/node-red-thingmonk-slide-22-300x230.png)](http://knolleary.net/talks/node-red-thingmonk/#/flow)

The challenge of integration is the diversity of skills and knowledge needed to get things talking.

Take for example, the challenge of Andy's Twittering Ferries. It required someone with knowledge of the AIS transponders to create the site that plotted the positions for Andy to find. It required the ability to scrape the data from the page and parse out the individual ferry's position and compare to the geo-fences. It required the ability to get through Twitter's OAuth authentication flows to get the tweet posted.

For all the security benefits brought by OAuth in replacing the exchange of usernames and passwords, it has probably been the root cause of more than its fair share of headaches as developers try to figure out which token goes where and is signed with what and when.

And that's a common problem. As a developer, you spend more time on HOW to integrate with something than you do on WHAT you want to do with it.

* * *

_At which point I introduce Node-RED, and demo what can be done with it_
