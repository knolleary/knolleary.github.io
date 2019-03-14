---
layout: post
title: Getting Node-RED to One Million downloads
date: 2018-03-16
tags: ["life","tech","node-red"]
---

In our recent project [update blog post](https://nodered.org/blog/2018/03/13/project-updates), I marked the fact Node-RED has recently hit 1 million downloads. It's a big milestone to reach for the project and a good opportunity to reflect back on how we've got here.

There are a couple of threads I want to explore.

*   Open by default
*   Low Code application development

### Open by default

When we started Node-RED, it was a tool to help us do our day job, but our day job wasn't to spend time writing development tools - it was to build real solutions for clients as part of our Emerging Technologies group. That had some consequences on how we approached developing Node-RED. It meant that we weren't adding features speculatively - everything we did was in reaction to a real need to do something. We were also limited in how much time we could spend on it during the day - evenings and weekends were much more the norm.

As we discussed how to push it to a wider audience we knew that open sourcing it was the only route we wanted to take. The alternative was for it to remain a proprietary piece of code that would likely sit on a shelf and only get used by us - which wasn't really an option.

I [spoke at MonkiGras a couple years ago](https://www.youtube.com/watch?v=Bbg1017amZs) about our experiences going through the open-sourcing process at IBM. It was a straight-forward process and very much reflected a growing attitude of being open by default - something that has continued to flourish and become an important part of our culture.

Being an open source project has been absolutely instrumental to the success we've seen, but it was never a guarantee of success. A 'build it and they will come' approach may have worked in Field of Dreams, but with any brand new open source project, it takes hard work to spread the word and get people engaged with it.

It also takes deliberate attention to develop in the open. Discussions that would previously have happened over a coffee in front of a whiteboard need to happen in an open forum. The long list of ideas written on sticky notes need to be visible to the community. Communication is key and I think this is an area we can continue to improve on.

### Low Code application development

Node-RED embodies a Low Code style of application development; where developers can quickly create meaningful applications without having to write reams of code. The term Low Code was coined by the Forrester Research in a [report published in 2014](https://www.forrester.com/report/New+Development+Platforms+Emerge+For+CustomerFacing+Applications/-/E-RES113411) - but it clearly embodies a style of development that goes back further back then that.

There are a number of benefits to Low Code application development, all of which we've seen first hand with Node-RED.

**It reduces the time taken to create a working application**

This allows the real value to be realised much quicker than with traditional development models.

**It is accessible to a wide range of developers and non-developers**

Above all else, this is one of the most important benefits we've seen. Anyone who understands a domain-specific problem, such as a business analyst, a linguist or a building engineer, will know the discrete steps needed to solve it. Node-RED gives them the tools to express those steps within a flow and build the solution for themselves.

**The visual nature helps users to see their application**

"_Show, don't tell_" is a powerful concept. We often see Node-RED get used to demo capabilities of APIs, such as the Watson cognitive services. It's so effective because the visualisation of your application logic shows the art of the possible without having to explain every semi-colon, bracket and brace. Not everyone thinks in lines of code; the visual representation of application logic is much more relatable.

This is all evident in the way Node-RED is often used as part of the [code patterns](https://developer.ibm.com/code/technologies/iot/) my colleagues produce on [IBM Code](https://developer.ibm.com/code).

### Low Code? But I *want* to write code

Low Code platforms may open up application development to a wider audience of developers, but they still have their critics in those who prefer to be able to tinker with the underlying code.

This is where the open by default approach of Node-RED brings us an advantage. Node-RED isn't a closed platform that acts entirely as a black-box. Anyone is able to look under the covers and see what's going on, to provide feedback or to suggest changes.

If someone finds a node that doesn't do quite what they need, they can easily work with the author to add the desired features, or choose to create their own node.

I think one of the most important things we did in the project at the very start was to make it possible for anyone to self-publish their own nodes. We chose not to become gate-keepers to what the community could add to Node-RED. The fact there are over 1300 3rd party nodes today, a number that climbs steadily, is testament to that decision.

### Getting to the next million

As we look to the future of the project, there is a lot still to come. The [roadmap to 1.0](https://nodered.org/blog/2017/07/17/roadmap-to-1-dot-0) opens up so much potential for new uses of Node-RED that we're all eager to get there as soon as we can. We continue to see more companies adopt Node-RED as part of their own developer experience. As the user community continue to grow, our real challenge is to grow the contributor community - helping drive the project forward.

I've talked about Low Code in this post and not mentioned IoT once. We are still, and will remain, IoT at heart. But there's a much broader framing of the project to consider beyond IoT. I have more personal flows doing simple web automation tasks than I do anything related to IoT. There's a huge developer audience to tap into who may otherwise be put off by our focus on IoT. How that framing takes shape is something we need to think carefully about.

Ultimately, Node-RED is an open source, low-code, event-driven, flow-based programming environment. It has a great community behind it and new users coming to it every day. I'm sure we'll get to the next million much quicker than the first.
