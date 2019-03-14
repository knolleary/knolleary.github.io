---
layout: post
title: Updated Arduino Client for MQTT
date: 2012-11-11
tags: ["arduino","mqtt","PubSubClient","tech"]
---

I've just tagged a new release of the Arduino Client for MQTT - [v1.9.1](https://github.com/knolleary/pubsubclient/tree/v1.9.1). This release includes an API change that will break existing sketches, something I'm very concious of doing - particular as the last release had such changes as well. But ultimately I decided this one was needed.

Previously, an instance of the client would be created with a call such as:
<pre>PubSubClient client(server, 1883, callback);</pre>

The library would then create an instance of `EthernetClient` under the covers. This was fine for hardware that used that class, but there are an increasing number of shields that use their own instance of the common `Client` API.

So, now the constructors for the client require an instance of `Client` to be passed in. For the vast majority of existing sketches, this just means changing the above line to something like:
<pre>EthernetClient ethClient;
PubSubClient client(server, 1883, callback, ethClient);</pre>

Amongst the other functional changes are the ability to publish a payload stored in `PROGMEM`, connect with a username/password and also the changes described in the [previous post](/2012/10/28/talking-to-cosm-from-an-arduino-using-mqtt/) to not fragment MQTT packets over multiple TCP packets.

There is also now a regression test suite for the library. Built using python and [Ino](http://inotool.org/), the suite first verifies each of the examples compiles cleanly, and if an Arduino is connected, it will upload each sketch in turn and run unit tests against it. So far the focus has been on the scaffolding of the test suite, with only a couple actual tests in place for the example sketches. I've tried to write it in a way to be agnostic of the library it's testing. There's more work to do on that side of things, but ultimately it could well be reused by others. I imagine it'll branch into its own repository when it gets to that point.

I've also given the [project page](https://pubsubclient.knolleary.net) a tidy and moved the API docs to their [own page](https://pubsubclient.knolleary.net).

Finally, I'm considering closing the comments on the project page. with 75 comments already, it isn't the best medium through which to provide support. I'm not sure pointing to the library's [issue tracker](https://github.com/knolleary/pubsubclient/issues) on github is necessarily the right thing either - it's an issue tracker, not a support forum. Perhaps I should set up a dedicated Google group for the library - or is that overkill?

Feedback, as ever, is welcome.
