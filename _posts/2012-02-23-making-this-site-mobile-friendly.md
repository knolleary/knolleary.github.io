---
layout: post
title: Making this site mobile friendly
date: 2012-02-23
tags: ["code"]
---

Another post in the series about things I've done with this site rather than write actual content.

I've been thinking about how to make things more friendly to mobile browsers around here. The easy option was to just install one of the established plugins, such as [WPTouch](http://www.bravenewcode.com/store/plugins/wptouch-pro/), to do all the heavy lifting. Which is exactly what I did a while ago, but I was never completely happy with the result. I didn't like the idea of having to create a mobile-specific theme, but without one the site would become yet another blog using WPTouch's default theme.

Going back to basics, there were essentially three things that needed looking at; layout, navigation and bandwidth.

Here's what the site looks like today:

![](/blog/content/2012/02/knolleary-ss.png "knolleary-ss")

A post's meta-information floats over on the left, outside the column of the page. That's fine if you've got the screen width to accommodate it, but on a mobile screen, it pushes the real content off the screen to the right.

To fix that, CSS Media Selectors come to the rescue. They allow you to specify CSS rules that should only be applied if certain conditions are met. In this instance, the conditions relate to the width of the screen displaying the page.

Here's an excerpt from the [stylesheet](https://github.com/knolleary/wp-knolleary-theme/blob/0461659181ddd1bb33f0009c3e9c1fd973074b6f/style.css) used to move the meta-information in-line with the main content:
<pre>
@media screen and (max-width: 1000px) {
   .meta {
      background: #efefef;
      float: none;
      width: 780px;
      margin-top: 0px;
      margin-left: 10px;
      border-bottom: 1px solid #999;
      padding: 3px;
   }
}
</pre>

Which results in something like this:

![](/blog/content/2012/02/knolleary-ss2.png "knolleary-ss2")

There are a number of other tweaks in the CSS to adapt the main column width depending on the screen size. For example, the footer content that is normally presented in three columns drops to two columns below a certain width and down to a single column at the smallest (ie mobile) size.

The nice thing with this technique is that it isn't specific to mobile; try resizing your desktop browser window to see it in action.

The next thing to tackle was navigation - in particular, keeping the links at the top accessible. A little bit of CSS and theme tweaking later, the site now has a static mini-header at the top that reveals itself as you scroll down the page. It is a simple effect, but one I find quite pleasing.

All of the things described so far are handled in the browser. But some work was needed on the server side to reduce the size of the page in terms of bandwidth. The first step of which was to properly detect if the browser accessing the page is a mobile or not - easily done by checking the User-Agent header for signs of mobile. The only slight difficulty is determining what a mobile user-agent looks like. Of course there are a number of open-source plugins for doing this sort of thing, but for now I've [rolled my own](https://github.com/knolleary/wp-knolleary-funcs/blob/master/wp-knolleary-funcs.php). It won't detect every mobile browser under the sun, but it'll hit the vast majority of them.

With that done, there are two things this site will do if it finds it is being served to a mobile. First, the 'recent things' column in the footer is omitted. This column comes from FriendFeed and likely contains a lot of images from Flickr, YouTube and Vimeo - depending on what I've been up to. This has the added benefit of reducing the length of the page, which gets quite excessive once the footer's three columns are stacked up.

The second thing done is a filter is applied to the main content of the page to replace any Flickr-sourced image with a smaller version. This can be done thanks to the predictable nature of [Flickr URLs](http://www.flickr.com/services/api/misc.urls.html).

I normally use the 500px wide images, which, as per the flickr docs, have urls of the form:
<pre>http://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}.jpg</pre>
which just needs an `_m` adding after the `{secret}` to get the 240px version.

Here's the function that does just that:
<pre>
function wp_knolleary_shrink_flickr_images($content) {
   if (wp_knolleary_is_mobile()) {
      return preg_replace('/(static\.?flickr.com\/.*?\/[^_]*?_[^_]*?)(\.jpg)/',"$1_m$2",$content);
   } else {
      return $content;
   }
}
add_filter( 'the_content', 'wp_knolleary_shrink_flickr_images');
</pre>

Admitted I wrote that regex late last night so could probably be simplified. But it works.

And that's where I've got to so far. I'm sure there is a lot more I could do on this topic - any feedback would be welcome. I find it much more satisfying to figure these things out, rather than just activate a plugin that does it all for me.

On a related note, I've put the [theme](https://github.com/knolleary/wp-knolleary-theme) and [plugin](https://github.com/knolleary/wp-knolleary-funcs) that this site uses onto github. More as a backup than in expectation of anyone forking it.