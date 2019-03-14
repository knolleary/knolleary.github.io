---
layout: post
title: Orb&#58; Fading the LEDs
date: 2012-04-08
tags: ["ambient orb","orb","orb"]
---

_[ part of the [orb series](/orb/) ]_

The Hello-World of Arduino sketches is making the on-board LED blink on and off. The equivalent for the orb is getting the three LEDs cycle through their three colours.

<pre>
// The nine LED pins
int LEDS[] = {7,6,5,A0,A1,A2,A3,A4,A5};

void setup() {
  // Set them all to be outputs
  for (int i=0; i<9; i++) {
    pinMode(LEDS[i],OUTPUT);
  }
}

void loop() {
  // Toggle each LED in turn
  for (int i=0; i<9; i++) {
    digitalWrite(LEDS[i],HIGH);
    delay(300);
    digitalWrite(LEDS[i],LOW);
  }
}
</pre>

Toggling the individual LEDs on and off like this is trivial but the Orb needs to be able to fade smoothly between colours. The normal approach to do this would be to use the Arduino's PWM pins and let the hardware deal with it. But with nine pins to control that isn't an option so the Orb has to resort to software PWM.

So, what is PWM and how can it be done in software? Pulse-width modulation is where an LED is rapidly turned on and off, many times a second. The greater the ratio of off to on, the dimmer the LED appears. If done fast enough, the eye doesn't see any flicker.

But therein lies a problem; the `digitalWrite` command is slow. Arduino is a great environment for hiding some of the underlying complexity of the hardware, but it occasionally does this at the cost of efficiency. 

To speed things up, the Orb has to go back to basics and manipulate the pins directly.

All of the IO pins on an Arduino are grouped into one of three [port registers](http://www.arduino.cc/en/Reference/PortManipulation). By toggling the appropriate bits in the registers, the pins can be controlled.

Using the same pin assignments as the previous example, the following macros can be used to control the LEDs.

<pre>
// Bit-masks for each pin of each LED
#define l1rm 0x80
#define l1gm 0x40
#define l1bm 0x20

#define l2rm 0x01
#define l2gm 0x02
#define l2bm 0x04

#define l3rm 0x08
#define l3gm 0x10
#define l3bm 0x20

#define LEDA(r1,g1,b1) PORTD = (PORTD&0x03)'(r1*l1rm)'(g1*l1gm)'(b1*l1bm)
#define LEDB(r2,g2,b2) PORTC = (PORTC&0xF8)'(r2*l2rm)'(g2*l2gm)'(b2*l2bm)
#define LEDC(r3,g3,b3) PORTC = (PORTC&0xC7)'(r3*l3rm)'(g3*l3gm)'(b3*l3bm)
</pre>

With this is place, we can do a first pass at PWM. For each LED, we'll define a brightness between 0 and 255. In each loop of the arduino code, a global counter is incremented. If the counter is less then an LED's brightness, the LED should be on, otherwise it should be off. Which looks something like this:

<pre>
byte brightness[] = {0,128,255, 0,128,255, 0,0,0 };
byte counter = 0;
void loop() {
  LEDA((brightness[0]>counter)?1:0,
       (brightness[1]>counter)?1:0,
       (brightness[2]>counter)?1:0);

  LEDB((brightness[3]>counter)?1:0,
       (brightness[4]>counter)?1:0,
       (brightness[5]>counter)?1:0);

  LEDC((brightness[6]>counter)?1:0,
       (brightness[7]>counter)?1:0,
       (brightness[8]>counter)?1:0);
  counter++;
}
</pre>

The problem with this approach is that it assumes `loop` will get called with an absolute regularity to keep things smooth. The code above would probably work fine, but once you add in handling of the radio to control things, then that regularity could be lost.

I came across a solution for this in a [blog post](http://jeelabs.org/2010/10/03/software-pwm-at-1-khz/) from the marvellous JeeLabs:

> What occurred to me, is that you could re-use a hardware counter which is always running in the ATmega when working with the Arduino libraries: the `TIMER-0` millisecond clock!> 
> 
> It increments every 4 µs, from 0 to 255, and wraps around every 1024 µs. So if we take the current value of the timer as the current time slot, then all we need to do is use that same map as in the original rgbAdjust sketch to set all I/O pins!

This introduces another idea that can make the code more efficient; rather than evaluate the brightness levels every time around the loop, create an array representing the 256 time-slots with the appropriate port register values pre-calculated.

With the arrays in place, the code in the `loop` function simply becomes:
<pre>
void loop() {
  PORTD = (PORTD&0x03)'portDSlots[TCNT0];
  PORTC = (PORTC&0xC0)'portCSlots[TCNT0];
}
</pre>

Setting up the slots can be done with the following code:
<pre>
void setupSlots(int r1,int g1,int b1,int r2,int g2,int b2,int r3,int g3,int b3) {
  memset(portDSlots,0,256);
  memset(portCSlots,0,256);

  for (int i=0;i<256;i++) {
    portDSlots[i] = ((r1>i)?l1rm:0)'((g1>i)?l1gm:0)'((b1>i)?l1bm:0);
    portCSlots[i] = ((r2>i)?l2rm:0)'((g2>i)?l2gm:0)'((b2>i)?l2bm:0)'
                    ((r3>i)?l3rm:0)'((g3>i)?l3gm:0)'((b3>i)?l3bm:0);
  }
}
</pre>

Fading can then be achieved by incrementally stepping to the desired brightness levels.

As before, the full code is available on [github](https://github.com/knolleary/multi-channel-orb/blob/master/code/orb_pwm_test/orb_pwm_test.ino).

<div style="text-align: center;"><iframe src="http://player.vimeo.com/video/32414670" width="500" height="281" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe></div>