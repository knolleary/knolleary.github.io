---
layout: post
title: Power Graphing
date: 2008-05-05
tags: ["currentcost","google charts","graph","home automation","tech"]
---

Since getting my [ meter online, it has been sending its readings to a server in the sky so charts like <a href="http://realtime.ngi.ibm.com/currentcost/">these](/2008/04/10/going-power-crazy/) can be produced. To really play with the data, I needed to start logging it locally and producing my own graphs. Here is a rambling rundown of how I got from XML being spat out by the device every 6 seconds to something like this:

![](https://chart.apis.google.com/chart?chg=100,20,1,7&chxt=y,x&chxl=0:'0'1'2'3'4'5'1:'2100'2300'0100'0300'0500'0700'0900'1100'1300'1500'1700'1900&chxp=1,2,11,19,27,36,44,53,61,69,78,86,95&chs=400x200&cht=lc&chds=0,5&chm=B,f3f3f3,0,0,0&chco=aaaaff&chd=t:0.348,0.348,0.319,0.311,1.285,0.683,0.338,0.349,0.398,0.39,0.356,0.477,0.274,0.264,0.572,0.637,0.406,0.382,0.368,0.324,0.325,0.917,0.322,0.358,0.342,0.318,0.191,0.124,0.209,0.204,0.192,0.213,0.205,0.196,0.374,1.753,1.537,0.976,0.552,0.556,0.513,0.433,0.363,0.341,0.575,0.46,0.188,0.123,0.248,0.204,0.195,0.116,0.215,0.207,0.226,1.574,0.636,0.214,0.206,0.209,0.204,0.648,0.694,0.628,0.599,0.689,0.743,1.222,0.278,0.394,0.326,0.394,0.225,0.184,0.13,0.145,0.23,0.226,0.222,0.133,0.133,0.237,0.231,0.223,0.13,0.234,0.229,0.222,0.203,0.197,0.193,0.17,0.198,0.176,0.275,0.328,0.287,0.212,0.159,0.192,0.19,0.212,0.292,0.298,0.418,0.332,0.789,0.894,0.719)

### Step One - Parsing the data

This was the easy part; AndySC had already put together a perl script for reading the serial port and doing the necessary parsing.

### Step Two - Publishing the data

Again, not much for me to do here as Andy's script already publishes the data to a set of topics over [MQTT](http://mqtt.org).

### Step Three - Logging the data

Finally, something for me to do. A couple years ago, I would have joined Andy's perl script with one of my own, but python is more my thing these days. I already had a piece of python that subscribes to the appropriate topics and posts the temperature values to [twitter](http://twitter.com/knolleary_house). It didn't take much to get the same script to subscribe to the power data and dump it into a MySQL database on the local machine.
> <pre>+----------------+---------+>
> ' when           ' power '>
> +----------------+---------+>
> ' 20080502231747 '    0.34 '>
> ' 20080502231753 '    0.33 '>
> ' 20080502231804 '    0.34 '>
> +----------------+---------+>
> </pre>

The table in the database is a very simple one at the moment; logging the power along with a timestamp. An entry is added to the table for every reading from the meter and having been running for 3 days there are just over 11,000 of them. I'll have to keep an eye on this to make sure it doesn't run away with my free disk space.

### Step Four - Graphing the data

[Roo](http://rooreynolds.com) showed me some stuff he's been playing with using the [Google Chart API](http://code.google.com/apis/chart/). Whilst I generally prefer to roll my own (aka, reinvent the wheel), I couldn't ignore just how easy it is to produce pretty graphs this way.

Before delving into the API, I needed to decide just what I wanted to produce. As there is such a range of chart types available, there are plenty of interesting things that could be done. Initially, however, I decided to stick with the traditional "power-usage-in-the-last-24-hours" chart.

The API has a limit on the amount of data that can be passed to it. So I needed to find a meaningful way to reduce the 4200 data points generated in 24 hours to around 100 at most. I soon settled on using the average value for each 10 minute period. This loses some resolution in the data, but it still shows the trends.

Generating the averages is a simple question of the right query on the database. With some trial and error, I eventually got to:
> `select concat(substring(substring(`when`,1,11),9,4),'0'), truncate(avg(`power`),3)  from currentcost where `when` > SUBDATE(NOW(), INTERVAL 1 DAY)  group by substring(`when`,1,11) order by `when`;`

Simple huh?

This produces results like this:
> <pre>+------+-------+>
> ' 2240 ' 0.714 '>
> ' 2250 ' 0.637 '>
> ' 2300 ' 0.406 '>
> +------+-------+</pre>

With that in place, all it took was to throw it together into an appropriate URL for google to generate the image:

> http://chart.apis.google.com/chart?chg=100,20,1,7&chxt=y,x&>
> chxl=0:'0'1'2'3'4'5' 1:'2100'2300'0100'0300'0500'0700'0900'1100'1300'1500'1700'1900& chxp=1,2,11,19,27,36,44,53,61,69,78,86,95&chs=400x200 &cht=lc&chds=0,5&chm=B,f3f3f3,0,0,0&chco=aaaaff& chd=t:0.348,0.348,0.319,0.311,1.285,0.683,0.338,0.349, 0.398,0.39,0.356,0.477,0.274,0.264,0.572,0.637,0.406, 0.382,0.368,0.324,0.325,0.917,0.322,0.358,0.342,0.318, 0.191,0.124,0.209,0.204,0.192,0.213,0.205,0.196,0.374, 1.753,1.537,0.976,0.552,0.556,0.513,0.433,0.363,0.341, 0.575,0.46,0.188,0.123,0.248,0.204,0.195,0.116,0.215, 0.207,0.226,1.574,0.636,0.214,0.206,0.209,0.204,0.648, 0.694,0.628,0.599,0.689,0.743,1.222,0.278,0.394,0.326, 0.394,0.225,0.184,0.13,0.145,0.23,0.226,0.222,0.133, 0.133,0.237,0.231,0.223,0.13,0.234,0.229,0.222,0.203, 0.197,0.193,0.17,0.198,0.176,0.275,0.328,0.287,0.212, 0.159,0.192,0.19,0.212,0.292,0.298,0.418,0.332,0.789,0.894,0.719

Again, simple huh? Well, maybe not so much. Here's a break down of what that does (and just to confuse matters, this is in a different order to where things appear in the url above...)

> http://chart.apis.google.com/chart?
This is base url of the Google Charts api - all the magic comes from here.

> chs=400x200
Set the size of the image.

> &cht=lc
Set the type of chart - a line chart.

> &chg=100,20,1,7
Gives the chart a grid in the background.

> &chxt=y,x
> &chxl=0:'0'1'2'3'4'5' 1:'2100'2300'0100'0300'0500'0700'0900'1100'1300'1500'1700'1900
> &chxp=1,2,11,19,27,36,44,53,61,69,78,86,95
Describes the axis labels. 0 to 5 on the y-axis, and the relevant times along the x-axis. The script figures out approximate positions along the axis for the labels.

> &chds=0,5
Specifies the minimum and maximum values for the data - although I occasionally go over 5Kw, I decided it wasn't worth squeezing the data for 99% of the time when it is below that.

> &chm=B,f3f3f3,0,0,0
Fills the area under the line with a light gray.

> &chco=aaaaff
Draws the line with a light blue.

> &chd=t:0.348,0.348,0.319,0.311,1.285,0.683,0.338,0.349, 0.398,0.39,0.356,0.477,0.274,0.264,0.572,0.637,0.406, 0.382,0.368,0.324,0.325,0.917,0.322,0.358,0.342,0.318, 0.191,0.124,0.209,0.204,0.192,0.213,0.205,0.196,0.374, 1.753,1.537,0.976,0.552,0.556,0.513,0.433,0.363,0.341, 0.575,0.46,0.188,0.123,0.248,0.204,0.195,0.116,0.215, 0.207,0.226,1.574,0.636,0.214,0.206,0.209,0.204,0.648, 0.694,0.628,0.599,0.689,0.743,1.222,0.278,0.394,0.326, 0.394,0.225,0.184,0.13,0.145,0.23,0.226,0.222,0.133, 0.133,0.237,0.231,0.223,0.13,0.234,0.229,0.222,0.203, 0.197,0.193,0.17,0.198,0.176,0.275,0.328,0.287,0.212, 0.159,0.192,0.19,0.212,0.292,0.298,0.418,0.332,0.789,0.894,0.719
Specifies the data points.

### What next?

*   [Chris](http://chrishodgins.tumblr.com/post/33810511) has started doing some interesting data analysis to see if he can automatically spot 'events' on the graph. Will be interesting to see what can be achieved here.
*   Andy's [twittering house](http://twitter.com/andy_house) got some linkage last week from both [Earth2Tech](http://earth2tech.com/2008/04/30/the-house-that-twitters-its-energy-use/) and [Wired Science](http://blog.wired.com/wiredscience/2008/04/online-homes-br.html). They mention the power orb that was written about [last year](http://www.eurekamagazine.co.uk/article/9654/Power-saving-traffic-light.aspx). I really like the idea of an ambient device for displaying this information - another project for the arduino list.
