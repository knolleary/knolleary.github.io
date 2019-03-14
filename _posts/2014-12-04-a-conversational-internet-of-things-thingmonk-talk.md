---
layout: post
title: A Conversational Internet of Things - ThingMonk talk
date: 2014-12-04
tags: ["eightbar","events","talks"]
---

_Earlier this year, Tom Coates wrote a [blog post](https://medium.com/product-club/interacting-with-a-world-of-connected-objects-875b4a099099) about his session at this year's O'Reilly Foo Camp. Over tea with colleagues, we talked about some of the ideas from the post and how some of our research work might be interesting when applied to them._

_One thing led to another and I found myself talking about it at ThingMonk this year. What follows is a slightly expanded version of my talk._

* * *

![ciot-0](/blog/content/2014/12/ciot-0-300x168.png)

![ciot-2](/blog/content/2014/12/ciot-2-300x168.png)

**Humanising Things**

We have a traditional of putting human faces on things. Whether it's literally seeing faces on the Things in our everyday lives, such as the [drunk octopus](https://www.flickr.com/photos/dbtelford/6967361278/) spoiling for a fight, or possibly the most [scary drain pipe](https://www.flickr.com/photos/blackbeltjones/5089926442/) ever.

Equally, we have a tendency to put a human persona onto things. The advent of Twitter brought an onslaught of Things coming online. It seemingly isn't possible for me to do a talk without at least a fleeting mention of Andy Standford-Clark's twittering ferries; where regular updates are provided for where each ferry is.

![ciot-5](/blog/content/2014/12/ciot-5-300x168.png)

One of the earliest Things on Twitter was Tower Bridge. Tom Armitage, who was working near to the bridge at the time, wrote some code that grabbed the schedule for the bridge opening and closing times, and created the account to relay that information.

![ciot-6](/blog/content/2014/12/ciot-6-300x168.png)

One key difference between the ferries and the bridge is that the ferries are just relaying information, a timestamp and a position, whereas the bridge is speaking to us in the first-person. This small difference immediately begins to bring a more human side to the account.
But ultimately, they are simple accounts that relay their state with whomever is following them.

This sort of thing seems to have caught on particularly with the various space agencies. We no longer appear able to send a robot to Mars, or land a probe on a comet without an accompanying twitter account bringing character to the events.

![ciot-7](/blog/content/2014/12/ciot-7-300x168.png)

There's always a sense of excitement when these inanimate objects start to have a conversation with one another. The conversations between the philae lander and its orbiter were particularly touching as they waved goodbye to one another. Imagine, the lander, which was launched into space years before Twitter existed, chose to use its last few milliamps of power to send a final goodbye.

![ciot-8](/blog/content/2014/12/ciot-8-300x168.png)

But of course as soon as you peek behind the curtain, you see someone running Tweetdeck, logged in and typing away. I was watching the live stream as the ESA team were nervously awaiting to hear from philae. And I noticed the guy in the foreground, not focused on the instrumentation as his colleagues were, but rather concentrating on his phone. Was he the main behind the curtain, preparing Philae's first tweet from the surface? Probably not, but for the purposes of this talk, let's pretend he was.

![ciot-9](/blog/content/2014/12/ciot-9-300x168.png)

The idea of giving Things a human personality isn't a new idea. There is a wealth of rigorous scientific research in this area.

One esteemed academic, Douglas Adams, tells us about the work done by the The Sirius Cybernetics Corporation, who invented a concept called Genuine People Personalities ("GPP") which imbue their products with intelligence and emotion.

He writes:

> Thus not only do doors open and close, but they thank their users for using them, or sigh with the satisfaction of a job well done. Other examples of Sirius Cybernetics Corporation's record with sentient technology include an armada of neurotic elevators, hyperactive ships' computers and perhaps most famously of all, Marvin the Paranoid Android. Marvin is a prototype for the GPP feature, and his depression and "terrible pain in all the diodes down his left side" are due to unresolved flaws in his programming.

In a related field, we have the [Talkie Toaster](http://reddwarf.wikia.com/wiki/Talkie_Toaster) created by Crapola, Inc and seen aboard Red Dwarf. The novelty kitchen appliance was, on top of being defective, only designed to provide light conversation at breakfast time, and as such it was totally single-minded and tried to steer every conversation to the subject of toast.

![ciot-13](/blog/content/2014/12/ciot-13-300x168.png)

**Seam[less'ful]ness**

In this era of the Internet of Things, we talk about a future where our homes and workplaces are full of connected devices, sharing their data, making decisions, collaborating to make our lives 'better'.

Whilst there are people who celebrate this invisible ubiquity and utility of computing, the reality is going to much more messy.

[Mark Weiser](http://en.wikipedia.org/wiki/Mark_Weiser), Chief Scientist at Xerox PARC, coined the term "ubiquitous computing" in 1988.

> Ubiquitous computing names the third wave in computing, just now beginning. First were mainframes, each shared by lots of people. Now we are in the personal computing era, person and machine staring uneasily at each other across the desktop. Next comes ubiquitous computing, or the age of calm technology, when technology recedes into the background of our lives.

Discussion of Ubiquitous Computing often celebrated the idea of seamless experiences between the various devices occupying our lives. But in reality, Mark Weiser advocated for the opposite; that seamlessness was undesirable and self-defeating attribute of such a system.

He preferred a vision of "Seamfulness, with beautiful seams"

![ciot-15](/blog/content/2014/12/ciot-15-300x168.png)

The desire to present a single view of the system, with no joins, is an unrealistic aspiration in the face of the cold realities of wifi connectivity, battery life, system reliability and whether the Cloud is currently turned on.

Presenting a user with a completely monolithic system gives them no opportunity to connect with and begin to understand the constituent parts. That is not it say this information is needed to all users all of the time. But there is clearly utility to some users some of the time.

When you come home from work and the house is cold, what went wrong? Did the thermostat in the living room break and decide it was the right temperature already? Did the message from the working thermostat fail to get to the boiler? Is the boiler broken? Did you forgot to cancel the entry in your calendar saying you'd be late home that day?

Without some appreciation of the moving parts in a system, how can a user feel any ownership or empowerment when something goes wrong with it. Or worse yet, how can they avoid feeling anything other than intimidated by this monolithic system that simply says "I'm Sorry Dave, I'm afraid I can't do that".

Tom Armitage [wrote up his](http://tomarmitage.com/2014/12/02/some-of-these-things-are-not-like-the-others/) talk from Web Directions South and published it earlier this week, just as I was writing this talk. He covers a lot of what I'm talking about here so much more eloquently than I am - go read it. One piece his post pointed me at that I hadn't seen was [Techcrunch's recent review of August's Smart Lock](http://techcrunch.com/2014/10/14/august-smart-lock-on-sale/).

![ciot-16](/blog/content/2014/12/ciot-16-300x168.png)

Tom picked out some choice quotes from the review which I'll share here:

> "...much of the utility of the lock was negated by the fact that I have roommates and not all of them were willing or able to download the app to test it out with me [...] My dream of using Auto-Unlock was stymied basically because my roommates are luddites."

> "Every now and then it didn't recognize my phone as I approached the door."

> "There was also one late night when a stranger opened the door and walked into the house when August should have auto-locked the door."

This is the reason for having beautiful seams; seams help you understand the edges of a devices sphere of interaction, but should not be so big to trip you up. Many similar issues exists with IP connected light bulbs. When I need to remember which app to launch on my phone depending on which room I'm walking into, and which bulbs happen to be in there, the seams have gotten too big.

In a recent [blog post](https://medium.com/product-club/interacting-with-a-world-of-connected-objects-875b4a099099), Tom Coates wrote about the idea of a chatroom for the house - go read it.

> Much like a conference might have a chatroom, so might a home. And it might be a space that you could duck into as you pleased to see what was going on. By turning the responses into human language you could make the actions of the objects less inscrutable and difficult to understand.

![ciot-17](/blog/content/2014/12/ciot-17-300x168.png)

This echoes back to the world of Twitter accounts for Things. But rather than them being one-sided conversations presenting raw data in a more consumable form, or Wizard-of-Oz style man-behind-the-curtain accounts, a chatroom is a space where the conversation can flow both ways; both between the owner and their devices, but also between the devices themselves.

What might it take to turn such a chatroom into a reality?

![ciot-18](/blog/content/2014/12/ciot-18-300x168.png)

**Getting Things Talking**

Getting Things connected is no easy task.

We're still in the early days of the protocol wars.

Whilst I have to declare allegiance to the now international OASIS standard MQTT, I'm certainly not someone who thinks one protocol will rule them all. It pains me whenever I see people make those sorts of claims. But that's a talk for a different day.

Whatever your protocol of choice, there are an emerging core set that seem to be the more commonly talked about. Each with its strengths and weaknesses. Each with its backers and detractors.

![ciot-19](/blog/content/2014/12/ciot-19-300x168.png)

What (mostly) everyone agrees on is the need for more than just efficient protocols for the Things to communicate by. A protocol is like a telephone line. It's great that you and I have agreed on the same standards so when I dial this number, you answer. But what do we say to each other once we're connected? A common protocol does not mean I understand what you're trying to say to me.

And thus began the IoT meta-model war.

There certainly a lot of interesting work being done in this area.

For example, HyperCat, a consortium of companies coming out of a Technology Strategy Board funded Demonstrator project in the last year or so.

![ciot-21](/blog/content/2014/12/ciot-21-300x168.png)

> HyperCat is an open, lightweight JSON-based hypermedia catalogue format for exposing collections of URIs. Each HyperCat catalogue may expose any number of URIs, each with any number of RDF-like triple statements about it. HyperCat is simple to work with and allows developers to publish linked-data descriptions of resources.

URIs are great. The web is made of them and they are well understood. At least, they are well understood by machines. What we're lacking is the human view of this world. How can this well-formed, neatly indented JSON be meaningful or helpful to the user who is trying to understand what is happening.

This is by no means a criticism of HyperCat, or any of the other efforts to create models of the IoT. They are simply trying to solve a different set of problems to the ones I'm talking about today.

![ciot-23](/blog/content/2014/12/ciot-23-300x168.png)

**Talking to Computers**

We live in an age where the talking to computers is becoming less the reserve of science fiction.

Siri, OK Google, Cortana all exist as ways to interact with the devices in your pocket. My four year old son walks up to me when I have my phone out and says: "OK Google, show me a picture of the Octonauts" and takes over my phone without even having to touch it. To him, as to me, voice control is still a novelty. But I wonder what his 6 month old sister will find to be the intuitive way of interacting with devices in a few years time.

The challenge of Natural Language Parsing, NLP, is one of the big challenges in Computer Science. Correctly identifying the words being spoken is relatively well solved. But understanding what those words mean, what intent they try to convey, is still a hard thing to do.

To answer the question "Which bat is your favourite?" without any context is hard to do. Are we talking to a sportsman with their proud collection of cricket bats? Is it the zoo keeper with their colony of winged animals. Or perhaps a comic book fan being asked to chose between George Clooney and Val Kilmer.

Context is also key when you want to hold a conversation. The English language is riddled with ambiguity. Our brains are constantly filling in gaps, making theories and assertions over what the other person is saying. The spoken word also presents its own challenges over the written word.

![ciot-28](/blog/content/2014/12/ciot-28-300x168.png)

"Hu was the premiere of China until 2012"

When said aloud, you don't know if I've asked you a question or stated a fact. When written down, it is much clearer.

![ciot-29](/blog/content/2014/12/ciot-29-300x168.png)

In their emerging technology report for 2014, Gartner put the Internet of Things at the peak of inflated expectation. But if you look closely at the curve, up at the peak, right next to IoT, is NLP Question Answering. If this was a different talk, I'd tell you all about how IBM Watson is solving those challenges. But this isn't that talk.

![ciot-30](/blog/content/2014/12/ciot-30-300x168.png)

**A Conversational Internet of Things**

To side step a lot of the challenges of NLP, one area of research we're involved with is that of Controlled Natural Language and in particular, Controlled English.

CE is designed to be readable by a native English speaker whilst representing information in a structured and unambiguous form. It is structured by following a simple but fully defined syntax, which may be parsed by a computer system.

It is unambiguous by using only words that are defined as part of a conceptual model.

CE serves as a language that is both understandable by human and computer system - which allows them to communicate.

For example,

<pre>there is a thermometer named t1 that is located in the room r1</pre>

A simple sentence that establishes the fact that a thermometer exists in a given room.

<pre>the thermometer t1 can measure the environment variable temperature</pre>

Each agent in the system builds its own model of the world that can be used to define concepts such thermometer, temperature, room and so on. As the model is itself defined in CE, the agents build their models through conversing in CE.

<pre>there is a radiator valve v1 that is located in the room r1
the radiator valve v1 can control the environment variable temperature</pre>

It is also able to using reasoning to determine new facts.

<pre>the room r1 has the environment variable temperature that can be measured and that can be controlled</pre>

As part of some research work with Cardiff University, we've been looking at how CE can be extended to a conversational style of interaction.

These range from exchanging facts between devices - the tell

<pre>the environment variable temperature in room r1 has value "21"</pre>

Being able to ask question - ask-tell

<pre>for which D1 is it true that
      ( the device D1 is located in room V1 ) and
      ( the device D1 can measure the environment variable temperature ) and
      ( the value V1 == "r1")</pre>

Expanding on and explaining why certain facts are believed to be true:

<pre>the room r1 has the environment variable temperature that can be measured and that can be controlled
    because
the thermometer named t1 is located in the room r1 and can measure the environment variable temperature
    and
the radiator valve v1 is located in the room r1 and can control the environment variable temperature</pre>

The fact that the devices communicate in CE means the user can passively observe the interactions. But whilst CE is human readable, it isn't necessarily human writeable. So some of the research is also looking at how to bridge from NL to CE using a confirm interaction:

<pre>NL: The thermometer in the living room has moved to the dining room
CE: the thermometer t1 is located in the room r2</pre>

Whilst the current research work is focused on scenarios for civic agencies - for example managing information exchange in a policing context, I'm interested in applying this work to the IoT domain.

With these pieces, you can begin to see how you could have an interaction like this:

<pre>
    User: I will be late home tonight.
    House: the house will have a state of occupied at 1900
    User: confirmed
    House: the room r1 has a temperature with minimum allowable value 20 after time 1900
           the roomba, vc1, has a clean cycle scheduled for time 1800
</pre>

Of course this is still quite dry and formal. It would be much more human, more engaging, if the devices came with their own genuine people personality. Or at least, the appearance of one.

<pre>
    User: I will be late home tonight.
    House: Sorry to hear that, shall I tell everyone to expect you back by 7?
    User: yes please    
    Thermometer: I'll make sure its warm when you get home
    Roomba: *grumble*
</pre>

I always picture the Roomba as being a morose, reticent creature who really hates its own existence. We have one in the kitchen next to our lab at work, set to clean at 2am. If we leave the door to the lab open, it heads in and, without fail, maroons itself on a set of bar stools we have with a sloped base. Some might call that a fault in its programming, much like Marvin, but I like to think its just trying to find a way to end it all.

This is all some way from having a fully interactive chat room for your devices. But the building blocks are there and I'll be exploring them some more.
