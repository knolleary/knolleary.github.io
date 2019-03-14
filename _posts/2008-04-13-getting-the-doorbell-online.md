---
layout: post
title: Getting the doorbell online
date: 2008-04-13
tags: ["arduino","home automation","tech"]
---

Following [Andy's](http://twitter.com/andy_house) example, I have setup a twitter account for my own [house](http://twitter.com/knolleary_house) to share its thoughts with the world on.

So far, it is busy twittering the changing temperature of my living room, as measured by the [CurrentCost meter](/2008/04/10/going-power-crazy/). At the moment it only tweets when the temperature changes at least 10 minutes since the previous change. This reduces some of the noise, but I think there is more to do. I don't necessarily care if the living room is 16&deg;C rather than 17&deg;C but do care if it is too cold or hot. This is a subject I will come back to another time once I have done some more experiementing.

More immediately, I set myself a challenge this weekend; to get the doorbell twittering.

To begin with I bought a cheap wireless doorbell set from Wickes to play with. This came with two receivers; a portable battery-powered one and a mains-powered one. Wasting no time I took one of them apart to find this:

![](/blog/content/2008/04/doorbell1.jpg "doorbell circuit")

The circuit has a very conveniently packaged daughterboard containing the wireless receiver. The clue was the aerial connecting to it (the white wire to the right) and even better, in the top left corner are the four pins connecting to the rest of the circuit. With my trusty multimeter, and the labels printed on the board, it didn't take long to work out the leftmost pin is ground, the rightmost pin is +3v and the other two are the magic data pins.

With my newly acquired [arduino](http://www.arduino.cc), itself a topic for another day, I hooked-up the four pins and fairly instantly had the arduino writing over its serial link to my laptop whenever the doorbell button is pushed. Of the two data pins, I found the one labeled "DAT" is the best trigger to use; the other one, "IDEL", seems to be more noisy and needs investigating.

The doorbell lets you pick from one of 15 channels to ensure you don't get interference from the neighbours. It also lets you pick one of three chimes to use, from the traditional ding-dong to the full Big Ben. As that setting is on the button itself, it must be sending it over the wireless signal. Currently my circuit triggers regardless of the channel setting of the button. I assume I need to do some more signal analysis on both the DAT and IDEL pins to figure this part out. For now, it works enough to prove the idea.

Here is the sketch I used. It does some simple debouncing by not triggering twice within 3 seconds.
<pre>
int potPin = 5; // Connected to 'DAT'
int val = 0;

long time = 0;
long debounce = 3000;

void setup() {
  Serial.begin(9600);
}

void loop() {
  val = analogRead(potPin);

  if (val > 0) {
    if (millis()-time > debounce) {
      Serial.print("ON:");
      time = millis();
    }
  }
}
</pre>

From this point, a bit of python and mqtt magic and the doorbell would be twittering. I say "would" as I haven't done this final piece of plumbing yet. I only have one arduino at the moment and I am not yet ready to dedicate it to any one task. Clearly I need to order a second arduino - its always good to have separate development and production systems.
