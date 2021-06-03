---
layout: post
title:  "Docker called me"
date:   2021-06-03
tags: ["docker", "feedback", "docker desktop", "macos"]
---

## Docker

I’ve been using `docker` since 2014. It is hard to imagine nowadays development and deployment without the containers.

Using it on a non-linux machines, especially on MacOS was always somewhat problematic. Running out of disk space, fans spinning like crazy, networking peculiarities.
Evolution of tooling and introduction of Docker Desktop improved things a lot. No more self-managed virtual machines, no more Vagrant provisioning. Start the desktop app and start using docker, magic.


## Docker Developer Preview Program

This year I gave in and finally bought my first personal laptop since 2010. Because I was using laptops from work for my personal stuff from time to time. But magic of M1 silicon was too attracting to resist it.

With M1 came new problems, especially with `x86` and `arm64` images and ability to run Docker at all. But it didn't took long to roll out first public betas for Developer Preview, so I decided to join this program.

I wanted to get new releases faster and  communicate M1 specific issues.
So I joined a [Docker Community Slack](dockercommunity.slack.com).

There is a small form to enroll into [Docker Developer Preview Program](https://www.docker.com/community/get-involved/developer-preview).
One of the questions is "What one feature what you add to Desktop?"

I realised that it would be nice to add Volume management and disk space management into the desktop app.

## The call

3 month later I receive an email from Senior Product Management Director from Docker, Inc.
She is interested in discussing the Volume Management I've wrote about in a feedback form.

This was a nice surprise and the first time any software vendor of this size came back to me. It feels good, when your comments are being noted.

I booked a call to the nearest time slot.
Zoom call consisted of several participants. Senior Product Manager, two Docker Desktop developers and a Technical Writer and me.

I had a chance to describe my thoughts and pain points we have using Docker Desktop.
I mentioned that one of the bigger issues on MacOS is that disk space tends to disappear quite fast.
Not all IT staff in my company is tech-savvy and knows how to fix issues. Like executing several CLI commands to free up space (`docker system df`, `docker volume prune`, remove dangling containers).

And while you already can see images and containers in Desktop App, you can not do the same with Volumes. And volumes tend to grow in size, and in case of our application, we have a lot of those. So disk space ends fast.
Having this feature inside the app would make it much easier to manage and free-up space when it's needed.

I also mentioned that `compose` integration can be improved.
Our application consists of 25 services. Orchestrating them in Desktop App is not always an easy task.
Sometimes you get `cannot execute docker-compose script` . Sometimes some Environment variables are missing or mounts are empty.

Then people of Docker said that they've been working on the Volume Management already. And they wanted to share it with me already to hear my feedback.
How awesome! This feature is due to be released next week, and I have an honour to review it and give feedback 😏

So I've got a chance to sneak peak new features in action, leave my comments and also learn something new for myself.
They described some extra volumes functionality related to volumes that I'd never thought about before.

That was a surprisingly great experience, which I couldn't even expect.

## Takeaways

Very positive experience and solid approach from Docker team. Reaching out to primary audience to discuss the major pain points is the right attitude.

I wish more companies would be that open and willing to accept ideas and suggestions.
