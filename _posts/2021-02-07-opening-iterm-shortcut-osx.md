---
layout: post
title: Opening a new iTerm window on OSX
---

I just got a new Macbook Pro (13" M1 8Gb 512Gb if you must know). This is my
third Mac but the first I have bought for myself - the other's being
work-provided machines.

I'm taking my time to set it up - doing it afresh rather than just blindly copying
over all my settings. Whilst it's more work to do it this way, it happens rarely
enough that I find it a soothing process. It also helps to clear out the cruft
that has gathered in my setup over the years. Given I've only *just* updated my work
Macbook to Big Sur, I'm also taking my time to see what's changed.

One of the things I setup on my first laptop a long, long time ago was global
keyboard shortcut to open a new iTerm window. So long ago, I couldn't remember
how I had done it and had to figure it out again.

So to save future me some effort, I thought I'd document how I've done it. There
may be other ways of doing it, but this is what works for me.


0. Install [iTerm2](https://iterm2.com/). There instructions may work with the default
   terminal app, but I've never tried it as I've always gone straight to replacing it
   with iTerm2.
1. Open the "Automator" app and create a new "Quick Action" document.
2. Configure it so it receives "no input" in "any application"
3. Add a "Run AppleScript" action and set its contents to the following:
    ```
    on run {input, parameters}
        tell application "iTerm"
            create window with default profile
        end tell
        return input
    end run
    ```
4. Save the document, giving it a catchy name like "iTermLauncher"
5. Open the "System Preferences" app and go into "Keyboard"
6. Under the "Shortcuts" tab, select "Services" on the left and then scroll all
   the way to the bottom of the list. You should find your "iTermLauncher" service
   under the "General" section.
7. Click on it, then click the "Add Shortcut" button. Enter the shortcut you want to use,
   I went with `Cmd-§` as it's unlikely to clash.

And with that, you're done. You should now be able to hit your shortcut to get
a new iTerm window open. OSX may ask your permission to run the launcher the first
time you trigger it with a new application in focus, but that soon passes.
