---
layout: post
title: Right-Handed Bullets
date: 2006-09-01
tags: ["bullets","code","css","links"]
---

In the endless process of refining the aesthetics of the site, I would like to have the list items in the sidebar have their bullets on the right-hand side of the item text rather than the default left.

A quick google reveals the `direction` CSS property which _almost_ does the necessary. Given a simple list like this:
<pre>
<ul>
   <li>A</li>
   <li>B</li>
   <li>C</li>
</ul>
</pre>
> *   A
> *   B
> *   C
setting the `direction` property to `rtl` - ie right-to-left - generates this:
<pre>
<ul style="direction:rtl;">
   <li>A</li>
   <li>B</li>
   <li>C</li>
</ul>
</pre>
> *   A
> *   B
> *   C

On the face of it, this is ideal. But if you have a punctuation character in there, such as the post counts against the catergory links, you hit a problem:
<pre>
<ul style="direction:rtl;">
   <li>A(1)</li>
   <li>B+</li>
   <li>C?</li>
</ul>
</pre>
> *   A(1)
> *   B+
> *   C?

This is a direct result of how right-to-left text works in CSS. There are a couple of possible work-arounds:

*   Set the `list-style` to `none` and set the background image of the element to include a bullet point on the right-hand side.
*   Apply `direction: rtl;` to the `<li>` elements and have a `<span>` element with its `direction` set to `ltr` surrounding the content in order to pull it back into place.
The first option feels dirty and I would rather not go near it.
The second option seems easier if it wasn't for the way Wordpress generates the list of categories. The function call to `wp_list_cats()` doesn't allow for custom HTML in the output, so it isn't possible to add the `<span>` element. I could write my own version of the function that did what I wanted - but that seems overkill.

For now I will live with the left-hand bullets - any other suggestions for moving the bullet over are welcome.