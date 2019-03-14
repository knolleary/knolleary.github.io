---
layout: post
title: Nokia LCD Shield for Arduino
date: 2009-01-10
tags: ["3d","arduino","code","lcd","shield","sketch","tech"]
---

[![Nokia 6610 + Joystick Shield](https://farm4.static.flickr.com/3098/3165600917_ab2bdbd84a.jpg)](http://www.flickr.com/photos/knolleary/3165600917/ "Nokia 6610 + Joystick Shield by nol, on Flickr")

I got an [LCD shield](http://www.nuelectronics.com/estore/index.php?main_page=product_info&cPath=1&products_id=10) along with a second Arduino a couple weeks ago but what with Christmas and finishing off the [Orb](/2009/01/05/monitoring-energy-use-with-an-orb/) I hadn't had much of a chance to play with it. Until tonight.

<div style="text-align: center;"><object type="application/x-shockwave-flash" width="400" height="300" data="http://www.flickr.com/apps/video/stewart.swf?v=66164" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"> <param name="flashvars" value="intl_lang=en-us&photo_secret=ff86f2d899&photo_id=3182729461"></param> <param name="movie" value="http://www.flickr.com/apps/video/stewart.swf?v=66164"></param> <param name="bgcolor" value="#000000"></param> <param name="allowFullScreen" value="true"></param><embed type="application/x-shockwave-flash" src="http://www.flickr.com/apps/video/stewart.swf?v=66164" bgcolor="#000000" allowfullscreen="true" flashvars="intl_lang=en-us&photo_secret=ff86f2d899&photo_id=3182729461" height="300" width="400"></embed></object></div>

<pre>/************************************************
 * Draws a rotating 3D cube on the LCD Shield
 * from Nuelectronics.
 *
 *    Nicholas O'Leary
 *    http://knolleary.net
 ************************************************/
#include "Nokia_lcd.h"
#include <avr/pgmspace.h>

float sin_d[] = { 0,0.17,0.34,0.5,0.64,0.77,0.87,0.94,0.98,1,0.98,0.94,
                  0.87,0.77,0.64,0.5,0.34,0.17,0,-0.17,-0.34,-0.5,-0.64,
                  -0.77,-0.87,-0.94,-0.98,-1,-0.98,-0.94,-0.87,-0.77,
                  -0.64,-0.5,-0.34,-0.17 };
float cos_d[] = { 1,0.98,0.94,0.87,0.77,0.64,0.5,0.34,0.17,0,-0.17,-0.34,
                  -0.5,-0.64,-0.77,-0.87,-0.94,-0.98,-1,-0.98,-0.94,-0.87,
                  -0.77,-0.64,-0.5,-0.34,-0.17,0,0.17,0.34,0.5,0.64,0.77,
                  0.87,0.94,0.98};

float d = 10;
float px[] = { -d,  d,  d, -d, -d,  d,  d, -d };
float py[] = { -d, -d,  d,  d, -d, -d,  d,  d };
float pz[] = { -d, -d, -d, -d,  d,  d,  d,  d };

float p2x[] = {0,0,0,0,0,0,0,0};
float p2y[] = {0,0,0,0,0,0,0,0};

int r[] = {0,0,0};

Nokia_lcd lcd=Nokia_lcd();

void setup(void){
  DDRB=0x2F;

  LCD_BACKLIGHT(1);
  lcd.cLCD_Init();
  lcd.cLCD_Box(0,0,131,131,FILL,BLACK);  

}

void loop(void)
{
  r[0]=r[0]+1;
  r[1]=r[1]+1;
  if (r[0] == 36) r[0] = 0;
  if (r[1] == 36) r[1] = 0;
  if (r[2] == 36) r[2] = 0;

  for (int i=0;i<8;i++)
  {
    float px2 = px[i];
    float py2 = cos_d[r[0]]*py[i] - sin_d[r[0]]*pz[i];
    float pz2 = sin_d[r[0]]*py[i] + cos_d[r[0]]*pz[i];

    float px3 = cos_d[r[1]]*px2 + sin_d[r[1]]*pz2;
    float py3 = py2;
    float pz3 = -sin_d[r[1]]*px2 + cos_d[r[1]]*pz2;

    float ax = cos_d[r[2]]*px3 - sin_d[r[2]]*py3;
    float ay = sin_d[r[2]]*px3 + cos_d[r[2]]*py3;
    float az = pz3-150;

    p2x[i] = 65+ax*500/az;
    p2y[i] = 65+ay*500/az;
  }
  lcd.cLCD_Box(0,0,131,131,FILL,BLACK);
  for (int i=0;i<3;i++) {
    lcd.cLCD_Line(p2x[i],p2y[i],p2x[i+1],p2y[i+1],RED);
    lcd.cLCD_Line(p2x[i+4],p2y[i+4],p2x[i+5],p2y[i+5],RED);
    lcd.cLCD_Line(p2x[i],p2y[i],p2x[i+4],p2y[i+4],RED);
  }    
  lcd.cLCD_Line(p2x[3],p2y[3],p2x[0],p2y[0],RED);
  lcd.cLCD_Line(p2x[7],p2y[7],p2x[4],p2y[4],RED);
  lcd.cLCD_Line(p2x[3],p2y[3],p2x[7],p2y[7],RED);
  delay(5);

}
</pre>

[![LCD Shield](https://farm4.static.flickr.com/3403/3183597108_cfd865f439.jpg)](http://www.flickr.com/photos/knolleary/3183597108/ "LCD Shield by nol, on Flickr")
