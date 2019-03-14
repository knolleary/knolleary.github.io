---
layout: post
title: Automated GitHub pull-request status updates with Node-RED
date: 2014-04-19
tags: ["code","node-red"]
---

Having recently added a Travis build for the Node-RED repository, we get a nice green, or sometimes nasty red, merge button on pull-requests, along with a comment from Travis thanks to GitHub's [Commit Status API](https://github.com/blog/1227-commit-status-api).

From a process point of view, the other thing we require before merging a pull-request is to ensure the submitter has completed a Contributor License Agreement, or CLA. This has been a manual check against a list we maintain. But with GitHub's recent addition of the [Combined Status api](https://developer.github.com/changes/2014-03-27-combined-status-api/) I decided we ought to automate this check.

And of course, why not implement it in a Node-RED flow.

There are a few simple steps to take:

1.  know there has been a pull-request submitted, or that we want to manually trigger a check
2.  check the submitter against the list
3.  update the status accordingly

Rather than poll the api to see when a new pull-request has arrived, GitHub allows you to register a Webhook to get an http POST when certain events occur. For this to work, we need an HTTP-In node to accept the request. As with any request, we need to make sure it is responded to properly, as well as keeping a log - handy for debugging as you go.

![nr-gh-flow-1](/blog/content/2014/04/nr-gh-flow-1.png)

With that in place, we can register the webhook on the repositories we want to run the checks on.

1.  From the repository page, find your way to the webhook page via Settings &#10141; WebHooks & Services &#10141; Add webhook
2.  Enter the url of the http-in node
3.  Select 'Let me select individual events.' and then pick, as a minimum, 'Pull Request' and 'Issue comment'
4.  Ensure the 'Active' option is ticked and add the webhook

When the POST arrives from GitHub, the `X-GitHub-Event` http header identifies the type of event that triggered the hook. As we've got a couple different types registered for the hook we can use a Switch node to route the flow depending on what happened. We also need a function node to access the http header as the Switch node can't do by itself.

<pre>
// GitHub Event Type
msg.eventType = msg.req.get('X-GitHub-Event');
return msg;
</pre>

![nr-gh-flow-2](/blog/content/2014/04/nr-gh-flow-2.png)

Skipping ahead a bit, to update the status of the commit requires an [http POST to the GitHub API](https://developer.github.com/v3/repos/statuses/#create-a-status). This is easily achieved with an HTTP Request node, but it does need to be configured to point to the right pull-request. Pulling that information out of the 'pull-request' webhook event is easy as it's all in there.

<pre>
// PR Opened
msg.login = msg.payload.pull_request.user.login;
msg.commitSha = msg.payload.pull_request.head.sha;
msg.repos = msg.payload.pull_request.base.repo.full_name;
return msg;
</pre>

It's a bit more involved with the 'issue-comment' event which fires for all comments made in the repository. We only want to process comments against pull-requests that contain the magic text to trigger a CLA check to run.

Even after identifying the comments we're interested in, there's more work to be done as they don't contain the information needed to update the status. Before we can do that, we must first make another [http request to the GitHub API](https://developer.github.com/v3/pulls/#get-a-single-pull-request) to get the pull-request details.

<pre>
// Filter PR Comments
msg.repos = msg.payload.repository.full_name;
if (msg.payload.issue.pull_request &&
       msg.payload.comment.body.match(/node-red-gitbot/i)) {
    msg.url = "https://api.github.com:443/repos/"+msg.repos+
              "/pulls/"+msg.payload.issue.number+
              "?access_token=XXX";
    msg.headers = {
        "user-agent": "node-red",
	    "accept": "application/vnd.github.v3"
    };
    return msg;
}
return null;
</pre>

Taking the result of the request, we can extract the information needed.

<pre>
// Extract PR details
var payload = JSON.parse(msg.payload);
msg.login = payload.user.login;
msg.commitSha = payload.head.sha;
msg.repos = payload.base.repo.full_name;
return msg;
</pre>

![nr-gh-flow-4](/blog/content/2014/04/nr-gh-flow-4.png)

Now, regardless of which event has been triggered we have everything we need to check the CLA status; if `msg.login` is in the list of users who have completed a CLA, send a 'success' status, otherwise send a 'failure'.

<pre>
// Update CLA Status
var approved = ['list','of','users'];

var login = msg.login;
var commitSha = msg.commitSha;
var repos = msg.repos;

msg.headers = {
	"user-agent": "node-red",
	"accept": "application/vnd.github.she-hulk-preview+json"
};

msg.url = "https://api.github.com:443/repos/"+repos+
          "/statuses/"+commitSha+
          "?access_token=XXX";

msg.payload = {
    state:"failure",
    description:"No CLA on record",
    context:"node-red-gitbot/cla",
    target_url:"https://github.com/node-red/node-red/blob/master/CONTRIBUTING.md#contributor-license-aggreement"
}

if (approved.indexOf(login) > -1) {
    msg.payload.state = "success";
    msg.payload.description = "CLA check passed";
}
return msg;
</pre>

![nr-gh-flow-3](/blog/content/2014/04/nr-gh-flow-3.png)

And that's all it takes.

One of the things I like about Node-RED is the way it forces you to break a problem down into discrete logical steps. It isn't suitable for everything, but when you want to produce event-drive logic that interacts with on-line services it makes life easy.

You want to be alerted that a pull-request has been raised by someone without CLA? Drag on a twitter node and you're there.

There are some improvements to be made.

Currently the node has the list of users who have completed the CLA hard-coded in - this is okay for now, but will need to be pulled out into a separate lookup in the future.

It also assumes the PR only contains commits by the user who raised it - if a team has collaborated on the PR, this won't spot that. Something I'll have to keep an eye on and refine the flow if it becomes a real problem.

Some of the flow can already be simplified since we [added template support](http://blog.nodered.org/2014/04/16/version-0-7-0-released/#deprecatinghttpget) for the HTTP Request node's URL property.

The final hiccup with this whole idea is the way GitHub currently present commit statuses on the pull-request page. They only show the most recent status update, not the combined status. If the CLA check updates first with a failure, then the Travis build passes a couple minutes later, the PR will go green thanks to the Travis success. The only way to spot the Combined Status is currently 'failure' is to dive into the API. I've written a little script to give me a summary of all PR's against the repositories, which will do for now.

Given the Combined Status API was only added as a preview last month, hopefully once it gets added to the stable API they will update how the status is presented to use it.

A final note, I've chosen not to share the full flow json here - hopefully there's enough above to let you recreate it, but if you really want it, [ping me](http://twitter.com/knolleary).
