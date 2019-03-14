---
layout: post
title: DIY Ambient Orb&#58; Redux
date: 2008-11-25
tags: ["ambient orb","arduino","blinkm","mqtt","tech"]
---

[![Orb](https://farm4.static.flickr.com/3191/3057363360_cdcb3fa2c1.jpg)](http://www.flickr.com/photos/knolleary/3057363360/ "Orb by nol, on Flickr")

[![Orb Base](https://farm4.static.flickr.com/3292/3057363366_08f02fdab4.jpg)](http://www.flickr.com/photos/knolleary/3057363366/ "Orb Base by nol, on Flickr")

[![RJ11](https://farm4.static.flickr.com/3065/3056432309_fdbfe431d9.jpg)](http://www.flickr.com/photos/knolleary/3056432309/ "RJ11 by nol, on Flickr")

<pre>
/************************************************
 * Enables a BlinkM to be controlled over MQTT.
 *  - subscribes to the topic 'blinkm'
 *  - expects messages of the format 'RRGGBB'
 *  - doesn't do any error handling
 * 
 *    Nicholas O'Leary
 *    http://knolleary.net
 ************************************************/
#include <Wire.h>
#include <Ethernet.h>
#include <PubSubClient.h>
#include <BlinkM_funcs.h>

byte mac[] = { 0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED };
byte ip[] = { 172, 16, 0, 50 };
byte server[] = { 172, 16, 0, 100 };

void callback(char* topic, byte* payload,int length) {
  byte a = toHex( payload[0],payload[1] );
  byte b = toHex( payload[2],payload[3] );
  byte c = toHex( payload[4],payload[5] );
  BlinkM_fadeToRGB( 0x09, a,b,c);
}

PubSubClient client(server, 1883, callback);

void setup()
{
  BlinkM_beginWithPower();
  BlinkM_setAddress( 0x09 );
  BlinkM_stopScript( 0x09 );

  Ethernet.begin(mac, ip);

  if (mqttClient.connect("blinkr")) {
    mqttClient.subscribe((uint8_t*)"blinkm");
  }
}

void loop()
{
  mqttClient.loop();
  delay(500);
}

// a really cheap strtol(s,NULL,16) - taken from BlinkMTester
#include <ctype.h>
uint8_t toHex(char hi, char lo)
{
    uint8_t b;
    hi = toupper(hi);
    if( isxdigit(hi) ) {
        if( hi > '9' ) hi -= 7;
        hi -= 0x30;
        b = hi<<4;
        lo = toupper(lo);
        if( isxdigit(lo) ) {
            if( lo > '9' ) lo -= 7;
            lo -= 0x30;
            b = b + lo;
            return b;
        }
    }
    return 0;
}</pre>