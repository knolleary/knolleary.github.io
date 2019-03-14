---
layout: post
title: Creating Joggler applications under Linux
date: 2010-05-31
tags: ["tech"]
---

I recently got an O2 Joggler as a cheap touch-screen device that is easily hacked to become a generally useful device. To run Ubuntu on it is as simple as plugging in a suitably installed USB drive. I haven't decided what I want to do with the device yet, but I wanted to see what could be done with the original software.

![](/blog/content/2010/05/o2-joggler-tablet-300x186.jpg "o2-joggler-tablet")

Under the covers, it already runs Linux with the entire interface built in Flash. This makes it a challenge to develop for - Linux certainly isn't overrun with Flash development tools. After some trial and error, I have figured out the basics. So herewith a beginners guide to developing Joggler applications under Linux.

Note, this is not intended to be a Flash or ActionScript tutorial - I am not an expert. Everything you see here I have worked out from scratch this week.

#### Installing dependencies

1. Install [swftools](http://swftools.org).
<pre>$ sudo apt-get install swftools</pre>
This provides a number of useful tools for working with flash swf files. The key one for our purpose is `as3compile` - an ActionScript 3.0 compiler.

2. Install a standalone flash player. I use [Adobe's own](http://www.adobe.com/support/flashplayer/downloads.html#fp10) - you can try one of the open-source alternatives if you want.

3. Register for, and download the SDK from [OpenPeak](http://dev.openpeak.com/SDK_logIn.php). This includes a complete version of the framework that lets you debug and run on your laptop, rather than have to copy over to the Joggler each time. The docs pdf included with the SDK explains how to do this in the 'Testing Applications' section.
<pre>$ cd SDK/published/
SDK/published$ flashplayer openframe.swf</pre>
![](/blog/content/2010/05/Screenshot-Adobe-Flash-Player-101-300x210.png "Screenshot-Adobe Flash Player 10")

#### Creating a new application

1. Create a new application directory under the SDK directory.
<pre>$ mkdir SDK/published/apps/DemoApp</pre>

2. Add an entry for the application to `applications.xml` file - this tells the framework where to find the various pieces.
<pre><app static="1" id="test" loc="./apps/DemoApp/"
          icon="icon.swf" app="main.swf" /></pre>

3. In the application directory, create a `language.xml` file. This contains all of the translatable text of your application. Even if you don't plan to translate your application, you must still create this file with an entry for the name to display beneath the icon on the main menu.
<pre><copy>
   <mm en="Demo App" />
</copy></pre>

#### Creating icon.swf

The documentation specifies what the icon movie must consist of - a 100x100 movie with a button. After some experimentation, I've got a template ActionScript file that does the job. Copy the following into a file called `icon.as` within the application directory.
<pre>
package {
    import flash.text.TextField ;
    import flash.text.TextFormat ;
    import flash.display.MovieClip;
    import flash.display.SimpleButton;
    import flash.display.Shape;
    import flash.filters.ColorMatrixFilter; 

    public dynamic class DemoIcon extends MovieClip  {
        public function DemoIcon() {
            // Create a button
            var button:SimpleButton = new SimpleButton();
            // Setup the various states of the button
            button.upState = new DemoIconButton();
            button.downState = new DemoIconButton();
            button.overState = button.upState;
            button.hitTestState = button.downState;
            // Add a fade to the down state of the button
            button.downState.filters = [(
                new ColorMatrixFilter([1, 0, 0, 0, 0, 
                                       0, 1, 0, 0, 0,
                                       0, 0, 1, 0, 0, 
                                       0, 0, 0, 0.7, 0]))];
            // Add the button to the stage
            button.x = 10;
            button.y = 10;
            addChild(button);
        }
    }

    class DemoIconButton extends Shape {
        public function DemoIconButton() {
            // Draw the button
            graphics.beginFill(0x996633);
            graphics.lineStyle(2,0xffffff);
            graphics.drawRoundRect(0, 0, 80, 80,20,20);
            graphics.endFill();
        }
    }
}
</pre>
Next, compile it to the required swf file:
<pre>SDK/published/apps/DemoApp$ as3compile icon.as</pre>

If you launch the openframe now, you should see the icon in place.

![](/blog/content/2010/05/icon-e1275258354260.png "icon")

As you can see, it isn't the most exciting icon. But it does have a nice fade effect when pressed. To change what it looks like, you can play around with the `DemoIconButton()` method - with a little help from the reference on [flash.display.graphics](http://www.adobe.com/livedocs/flash/9.0/ActionScriptLangRefV3/flash/display/Graphics.html).

#### Creating main.swf

I'm still working out how best to approach writing the main application. There are some parts in the documentation that simply don't work for me - this may well be a result of not using the official Flash development tools.

The docs say the main app needs to include a class that extends `op.framework.OpenFrameApplication`. I found importing this class, even without using it, made the app fail to launch. Not a great start. However, it seems to work without using this class.

 Copy the following into a file called `main.as` within the application directory.
<pre>
package
{
    import flash.display.MovieClip;
    import flash.display.*;
    import flash.text.*;

    public class DemoMain extends MovieClip {
        function DemoMain() {
            graphics.beginFill(0x000000);
            graphics.drawRect(0, 0, 800, 410);
            graphics.endFill();

            var textField = new TextField();
            var textFormat = new TextFormat();
            textFormat.font = "Arial";
            textFormat.size = 30;
            textFormat.color = 0xffffff;
            textFormat.bold = true;
            textField.defaultTextFormat = textFormat;
            textField.text = "Hello World!";
            textField.autoSize = TextFieldAutoSize.LEFT;
            var tm = textField.getLineMetrics(0);
            textField.x = 400-tm.width/2;
            textField.y = 200-tm.height/2;
            addChild(textField);
        }
    }
}
</pre>
As before, compile it to the required swf file:
<pre>SDK/published/apps/DemoApp$ as3compile main.as</pre>

![](/blog/content/2010/05/mainappscreenshot-300x208.png "mainappscreenshot")

#### Using the `op.*` libraries

The framework includes a number of actionscript libraries to provide integration with the platform. They are provided as uncompiled actionscript files under the `SDK/op` directory. To compile against them, `as3compile` needs to know where they are. Assuming you're still developing in the application directory created earlier, then the following does the job:
<pre>SDK/published/apps/DemoApp$ as3compile -I../../../ main.as</pre>

 I have had mixed success using these libraries - here are some of my findings that may help you.. or not.
<dl>
<dt>`op.framework.OpenFrameApplication`</dt>
<dd>As mentioned previously, simply importing this class is enough to stop things working.</dd>
<dt>`op.framework.OPLang`</dt>
<dd>This class provides access to the entries in `language.xml` file. When included, I get the following compile error for which I have yet to find a workaround:
<pre>op/framework/OPLang.as:80:39: error: can't convert type String to XMLList</pre>
This currently rules out using this class.
</dd>
<dt>`op.framework.OPLink`</dt>
<dd>This class provides the main link between the application and the underlying framework. When included, I get the following compile error:
<pre>op/framework/OPLink.as:13:30: error: syntax error, unexpected *=</pre>
This is easily fixed by adding a space between the `*` and `=` in two lines of the library:
<pre>private static var apploc:* = null;
private static var so:* = null;</pre>
</dd>
<dt>_Anything_ that imports `fl.*`</dt>
<dd>It appears that whilst `as3compile` can handle references to the core `flash.*` packages, it knows nothing of the `fl.*` ones. Haven't found a solution to this yet.</dd>
</dl>

#### Running on the Joggler

You'll need a means to copy over your newly developed application to the Joggler. Start by installing [telnet](http://jogglerwiki.info/index.php?title=Installing_Telnet "Installing_Telnet"), then [ssh](http://jogglerwiki.info/index.php?title=Ssh "Ssh") and finally [scp](http://jogglerwiki.info/index.php?title=Scp "Scp").

The install process is the same as I described before; creating a directory for the application, followed by adding an entry to `applications.xml`. This all goes under `/media/appshop`. Once in place, you need to restart the software to pick up the new app:
<pre>$ killall tango</pre>

#### Conclusion

As you can see, it isn't the smoothest experience. But with some perseverance, the end results ought to be worth it.