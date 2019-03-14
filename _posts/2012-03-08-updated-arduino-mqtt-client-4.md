---
layout: post
title: Updated Arduino MQTT Client
date: 2012-03-08
tags: ["mqtt","tech"]
---

A new version of the Arduino MQTT client is available - from the [usual place](http://knolleary.net/arduino-client-for-mqtt/).

This release brings a handful of changes, but there are a couple I wanted to draw attention to; particularly as _one will require a minor change to sketches using this library_.

When I wrote the first prototype of the client, I made the decision to limit packets to 128 bytes. This was a pragmatic decision to balance memory usage and usefulness; who would possible want to publish more than 128 bytes from an Arduino?

I knew the limit was just a `#define` in the code, so anyone could change the limit if they wanted. But I didn't think that all the way through and it turns out there were a couple of issues with this:

*   `uint8_t` was used in lots of places to store lengths, which put an internal limit of 256 bytes,
*   the packet length was always encoded as a single byte - which is only correct for packets shorter than 128 bytes due to the multi-byte integer encoding MQTT uses.

So, with this release, you can now modify the `#define` in `PubSubClient.h` to a larger value and it'll work.

The second change is a wide ranging tidy up of the types used in the library, both internally and on the API. The external part of this is primarily that all of the functions that were defined to return an `int` type to indicate success or failure, now return a `boolean` type. This change should be compatible with existing scripts.

A knock-on effect of both of these changes will require a change to any sketch that provides a message callback. The `length` argument of the callback function signature has changed from `int` to `unsigned int`. When you try to compile a sketch without this change, you'll get an error along the lines of:

<pre>error: invalid conversion from
  'void (*)(char*, byte*, int)'
 to
  'void (*)(char*, uint8_t*, unsigned int)'
</pre>

Hopefully that will help the google-juice for anyone who hits this error and hasn't read the change log.

As ever, check out the [project page](https://pubsubclient.knolleary.net) for more details and a download link.
