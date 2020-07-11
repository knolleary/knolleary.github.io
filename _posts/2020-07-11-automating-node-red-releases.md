---
layout: post
title: Automating Node-RED releases with GitHub Actions
description: How I finally got around to automating parts of the Node-RED release process using GitHub Actions
image: /blog/content/2020/07/ghactions.png
tags: ["code","tech","node-red"]
---

When we do new releases of Node-RED there's a mental checklist of tasks I run through.

 - run the release build
 - create the draft GitHub release
 - attach the built zip to the release
 - publish the modules to npm
 - publish the GitHub release
 - publish the release blog post
 - post to the forum
 - tweet about it

Then about an hour later I remember to kick-off the Docker build and update the
Node-RED webpage to reflect the new version number.

For some reason, these last two steps often get overlooked - they just don't form
part of the critical path in my mind for getting the release published.

They have always been ripe for automation as they both just involve updating the
version number in some files. The problem was the effort to set that up has never
really been worth the benefit.

But then along came [GitHub Actions](https://github.com/features/actions) and it
all got much easier. This blog post details how I automated away those steps of
the release process.

### Workflow steps

The full workflow is [defined here](https://github.com/node-red/node-red/blob/62c01b59b2e655bf07f363983abc3a09a8bdfcbe/.github/workflows/build.yml). I've linked to the version of the workflow as of the 1.1.2
release just in case the latest version has completely changed by the time you
come to read this.

 To begin with, we tell GitHub to trigger the workflow whenever we tag a new
 release.

 ```yaml
 on:
  release:
    types: [published]
```

We then define the environment to run the workflow on and the steps it runs.

```yaml
jobs:
  generate:
    name: 'Update node-red-docker image'
    runs-on: ubuntu-latest
    steps:
     ...
```

The actual work to be done involves:

 - checkout the `node-red` repository as it contains some scripts we need later
 - checkout the `node-red-docker` repository, update some of its files and raise
   a pull-request on the repository with the changes
 - checkout the `node-red.github.io` repository, update its `index.html` file and
   raise a separate pull-request on the repository with that change

#### Checking out repositories

The checkouts are easy to do with the [actions/checkout@v2](https://github.com/act(https://github.com/actions/setup-node)ions/checkout)
action. As we need to checkout multiple repositories, each is put into its own
directory:

```yaml
- name: Check out node-red repository
  uses: actions/checkout@v2
  with:
      path: 'node-red'
- name: Check out node-red-docker repository
  uses: actions/checkout@v2
  with:
      repository: 'node-red/node-red-docker'
      path: 'node-red-docker'
- name: Check out node-red.github.io repository
  uses: actions/checkout@v2
  with:
      repository: 'node-red/node-red.github.io'
      path: 'node-red.github.io'
```

#### Updating files

With all of the repositories checked out, the next task is to update the necessary
files.

This needs some custom code and having looked at the various options such as
creating a custom docker file, I went with the simple option of a pair of node.js scripts.

That first needs the [actions/setup-node@v1](https://github.com/actions/setup-node)
action to get Node 12 installed and ready to run:

```yaml
- uses: actions/setup-node@v1
  with:
      node-version: '12'
```

The scripts themselves are:

 - [update-node-red-docker.js](https://github.com/node-red/node-red/blob/62c01b59b2e655bf07f363983abc3a09a8bdfcbe/.github/scripts/update-node-red-docker.js)
 - [update-node-red-website.js](https://github.com/node-red/node-red/blob/62c01b59b2e655bf07f363983abc3a09a8bdfcbe/.github/scripts/update-node-red-website.js)

I won't bother with a line by line commentary, but they both follow the same structure.

They begin with a bunch of common code that:
 - grabs the new version number from the `node-red` repository's `package.json` file.
 - verifies the tag that triggered the action matches that version - a safety net
   to ensure we only do this on proper releases.
 - verifies the version is for a stable release - we don't want to update things for `x.y.z-beta` releases

They then do their work on the files that need updating - mostly just search and
replace of the version numbers - before saving the changes back.

One thing to highlight from the docker update script is the line:

```javascript
console.log(`::set-env name=newVersion::${newVersion}`);
```

That syntax causes the `newVersion` environment variable to be set to the value of
the `newVersion` variable in the script. This comes in handy in a later step.


The scripts are run with:

```yaml
- run: node ./node-red/.github/scripts/update-node-red-docker.js
- run: node ./node-red/.github/scripts/update-node-red-website.js
```


#### Raising pull-requests

Finally, it's time to raise pull requests on the corresponding repositories using
the [peter-evans/create-pull-request@v2](https://github.com/peter-evans/create-pull-request) action.

Here's the configuration of the step for the docker repo PR:

```yaml
- name: Create Docker Pull Request
  uses: peter-evans/create-pull-request@v2
  with:
    token: {{ "${{ secrets.NR_REPO_TOKEN " }}}}
    committer: GitHub <noreply@github.com>
    author: {{ "${{ github.actor" }}}} <${{ github.actor }}@users.noreply.github.com>
    path: 'node-red-docker'
    commit-message: 'Bump to {{ "${{ env.newVersion "}}}}'
    title: '🚀 Update to Node-RED ${{ env.newVersion }} release'
    body: |
      Updates the Node-RED Docker repo for the ${{ env.newVersion }} release.
      Once this is merged, you will need to create a new release with the tag `v${{ env.newVersion }}`.
      This PR was auto-generated by a GitHub Action. Any questions, speak to @knolleary
```

Most of that should be fairly self explanatory, although there are a couple bits
to highlight.

First, note the `{{ "${{ env.newVersion "}}}}` bit that picks up the environment
variable set by the docker script so that the version can be included in the
title and description of the pull-request.

The second bit that needs highlighting is the `token` value. This uses a personal
access token of a GitHub user that has write permission on the repository, which
has been added as a secret to the node-red repository settings.

I original set this up using a token for my account - but that would mean any
action in the Node-RED repo would be able to do *anything* as me on *any* of the
repositories I have write access to. So I created a NodeREDBot user, gave them
write access to just these two repositories and generated an access token with
the smallest set of permissions possible.

I've seen GitHub acknowledge their personal access tokens need finer grained scopes
down to individual repositories, but until that happens, we'll stick with the bot user.

### Done

Now, whenever I tag a new release, within a couple minutes pull requests arrive
on the docker and website repositories with all the updates that are needed.

As my first foray into GitHub actions, it didn't take long to get this all strung
together. It was very satisfying to see the PRs arrive when I did the 1.1.1
and [1.1.2](https://github.com/node-red/node-red-docker/pull/189) releases this week.

Automating these little tasks makes such a difference. Having seen how easy it is
to get started, I'm now looking for what else we could use them for.

One idea is to automatically raise an issue on the website repository if any
core issue or pull-request has a `needs-docs` label adding. Updating the docs is
often overlooked by contributors and I often spend a week before a release working
through the backlog of doc updates needed. Having a tracking issues raised
through-out the development cycle should help us keep on top of it.

We also have some [API docs on the website](https://nodered.org/docs/api/modules/)
that are generated from the source code, but a pain to update on the site. It's
probably less than an hours work to automate that now I have all these pieces
in place.

