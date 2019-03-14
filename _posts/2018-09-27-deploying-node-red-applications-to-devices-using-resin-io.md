---
layout: post
title: Deploying Node-RED applications to devices using Resin.io
date: 2018-09-27
tags: ["code","tech","node-red"]
---

My last couple of posts have focused on creating a managed Node-RED deployment pipeline to IBM Cloud. There's still more to do in that series, but for this one, I'm taking a bit of a detour to the edge of the network.

One of the strengths of Node-RED is that it runs on devices just as happily as it does in cloud environments. This post looks at how we can replicate the deployment pipeline model from the first post, but this time target devices running in remote locations.

To do this, we're going to use [resin.io](https://resin.io) - a platform for managing fleets of connected devices, that makes updating them as easy as doing a `git push`. I've been meaning to play with Resin.io for ages and having got this working in no time today, I'm a tiny bit in love.

* * *

### Getting started

Before we begin, you'll need:

*   A [Resin.io](https://resin.io/) account - their free plan lets you create one application with up to 10 devices
*   A pair of Raspberry Pis

For this guide, I'm going to use two Raspberry Pis; one as the 'development' machine and one as a target device to push updates to via resin.io. You could just as easily use your laptop as the development machine to get started.

* * *

### Create a new Node-RED project

As with the [previous post](/2018/06/01/creating-a-node-red-deployment-pipeline-to-ibm-cloud/) you'll need to enabled the Projects feature in Node-RED.

On the 'development' Pi, edit your `settings.js` file to set `editorTheme.projects.enabled` to true. You may find there's already an `editorTheme` entry in the file with a `menu` property - you'll need to add in the `projects` property alongside that:

        editorTheme: {
            projects: {
                enabled: true
            },
            menu: { ... }
        }

Then restart Node-RED using `node-red-stop && node-red-start`. If you aren't using a Pi, you'll need to use whatever platform-appropriate means you have to restart.

At this point you can either follow the previous post to create a GitHub repository for your project and clone it locally, or you can create an entirely local project. This guide doesn't make use of GitHub, but the option is there if you want.

The most important thing is to make a note of the key you choose to encrypt your credentials file with - you'll need that later.

* * *

### Turn the project into a deployable application

Once again, we need to edit some of the project files so it can be deployed as a standalone application.

The `package.json` file is updated as before - make sure to leave the `node-red` section alone if you've picked different flow file names when creating the project:

    {
        "name": "node-red-demo-1",
        "description": "A Node-RED Project",
        "version": "0.0.1",
        "dependencies": {
            "node-red": "0.19.*",
            "node-red-node-pi-sense-hat": ">0.0.18"
        },
        "node-red": {
            "settings": {
                "flowFile": "flow.json",
                "credentialsFile": "flow_cred.json"
            }
        },
        "scripts": {
            "start": "node --max-old-space-size=160 ./node_modules/node-red/red.js --userDir . --settings ./settings.js flow.json"
        }
    }

I've included the `node-red-node-pi-sense-hat` nodes as the demo I'm building beyond this guide uses that particular accessory.

#### Add a settings file

The `settings.js` file can be created with the following:

    module.exports = {
        credentialSecret: process.env.NODE_RED_CREDENTIAL_SECRET,
        httpAdminRoot: false
    }

By setting `httpAdminRoot` to `false`, the editor and admin apis will be disabled.

#### Add a Dockerfile

Resin.io uses docker images as the unit of deployment. To that end, we need to add a `Dockerfile` to build our application:

    FROM resin/raspberrypi3-node:8-slim

    # use apt-get if you need to install dependencies,
    # for instance if you need ALSA sound utils, just uncomment the lines below.
    #RUN apt-get update && apt-get install -yq \
    #    alsa-utils libasound2-dev && \
    #    apt-get clean && rm -rf /var/lib/apt/lists/*

    RUN apt-get update && apt-get install -yq \
          python3=3.4.2-2 sense-hat raspberrypi-bootloader i2c-tools build-essential \
          libssl-dev libffi-dev libyaml-dev python3-dev python3-pip python-rpi.gpio && \
        pip3 install sense-hat rtimulib pillow

    # Defines our working directory in container
    WORKDIR /usr/src/app

    # Copies the package.json first for better cache on later pushes
    COPY package.json package.json

    # This install npm dependencies on the resin.io build server,
    # making sure to clean up the artifacts it creates in order to reduce the image size.
    RUN JOBS=MAX npm install --unsafe-perm && npm cache clean --force && rm -rf /tmp/*

    RUN apt-get remove build-essential libssl-dev libffi-dev libyaml-dev python3-dev python3-pip \
        && apt-get autoremove && apt-get clean && rm -rf /var/lib/apt/lists/*

    # This will copy all files in our root to the working  directory in the container
    COPY . ./

    # Enable systemd init system in container
    ENV INITSYSTEM on

    # server.js will run when container starts up on the device
    CMD ["npm", "start"]

I won't go into all the details of the Dockerfile. It took a bit of trial and error to get the right dependencies installed for the SenseHAT.

### Commit and push changes

At this point, all of the necessary changes have been made to the project files and you should commit the changes. You can do this either via the git command-line, or from within Node-RED.

#### Committing via the command-line

From within the project directory, `~/.node-red/projects/<name-of-project>`, run the commands:

    git add package.json Dockerfile settings.js
    git commit -m "Update project files"

#### Committing via Node-RED

Within Node-RED, open up the `history` sidebar tab. You should see the changed files in the 'Local files' section. If you don't, click the refresh button to update the view. When you hover over each file a `+` button will appear on the right - click that button to move the file down to the 'Changes to commit' section.

Once they are all staged, click the 'commit' button, enter a commit message and confirm.

Switch to the `Commit History` section and you should see two commits in the list - the initial `Create project files` commit and the commit you've just done.

### Setting up resin.io

Next we're going to get the second Pi setup as a managed device. Resin.io provide a great [getting started tutorial](https://docs.resin.io/learn/getting-started/raspberrypi3/nodejs/) that you should follow up to and including the 'Provision your device' step.

That should get to the point where the Pi shows as connected in your resin.io dashboard.

### Deploying your application

Before we can get deploy the application, we need to:

*   setup some SSH keys so our development Pi is able to push changes to resin.io,
*   tell Node-RED where to push the application,
*   configure your device with the credential key

#### Generate SSH keys

Open up the Node-RED settings dialog (from the main menu) and switch to the 'Git config' tab. Click the 'add key' button, give it a name, and optionally a passphrase, then click 'generate key'. After a few seconds you'll be shown you new public key, which you should copy to your clipboard.

Over in your [resin.io preferences](https://dashboard.resin.io/preferences/sshkeys) you can then add that public key to your account.

#### Configure your git remote

Resin.io provides a remote git repository you push your application to in order to trigger a deployment. In your applications dashboard page you should see a text input with a `git remote` command in. The full command will look like:

    git remote add resin <user>@git.resin.io:<user>/<app>.git

You can either run that command in the directory `~/.node-red/projects/<name-of-project>`, or you can add it via the Node-RED editor. To do it via the editor, open up the Project settings dialog by clicking the `...` button next to the project name in the Info sidebar tab and then switch to the Settings tab. Click 'add remote', give it a name of `resin` and copy in the url from the command.

#### Tell your device its credential key

The final step is to give your device the key to decrypt its credentials file. We already setup the `settings.js` file to look for the `NODE_RED_CREDENTIAL_SECRET` environment variable. In the resin.io application dashboard you should add a new Environment Variable with that name and the value you gave when generating your project.

### Push your application

At last we can push the project to resin. In the Commit History section of the Node-RED Project History sidebar tab, click the button with two arrows. Click the 'Remote: none' button to pick which remote to push to. It may prompt you to pick an ssh key at this point - pick the one you generated earlier. If you originally cloned the project from github, you'll need to pick the 'resin' remote. Finally click 'push'.

If all goes well, your project will be pushed to resin.io and its docker image built.

Now, confession time. In putting this guide together, I've hit a couple usability issues with the git integration in Node-RED. When pushing to a remote git repository, you don't get any feedback - just a spinning animation. That's not normally much of an issue as it is fairly quick, but in the resin.io case, when you push it runs the build and provides the full log in return. That's invaluable in figuring out what you got wrong in the Dockerfile - but Node-RED doesn't show you any of it. It can also take a minute or two - longer the first time you do it, but quicker in subsequent pushes.

I did find myself resorting to pushing from the command line, using `git push resin master` in the project directory so I could see that output. Something for us to improve in the future.

Assuming your push worked, you should see the update arrive in the resin.io dashboard and be able to track its deployment to your device. The dashboard also shows you the application logs _and_ lets you ssh into your device from the browser. It really is a delightful experience.

All being well, you should see Node-RED startup in the device logs.

### Developer workflow

With everything in place, you should now have a developer workflow that consists of:

1.  developing and testing on a local Raspberry Pi
2.  committing changes, giving you full version control
3.  optionally pushing those changes to GitHub, or any other hosted git service
4.  deploying the application to your managed devices, with a simple push to the resin.io remote.

One thing worth looking at is to enable the 'Delta updates' feature on resin.io. This keeps the size of any update to a bare minimum - which if its mostly just your flow file can be a huge saving compared to pushing a complete docker layer. I'm not entirely sure why this feature isn't enabled by default, but you can find out how to turn it on [here](https://docs.resin.io/learn/deploy/delta/).

### Next steps

With this basic workflow in place, we can start thinking about how it would work with multiple devices. The great thing with resin.io is that it'll push your application to all of the connected devices. That does pose some challenges for us. For example, if we want each device to connect to Watson IoT Platform with its own set of credentials, we need a mechanism to give each device its own details _and_ be able to make use of that in the Node-RED flow configuration. Thankfully you can go a long way with a few environment variables. But that's for another post.
