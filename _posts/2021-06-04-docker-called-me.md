---
layout: post
title:  "Docker called me"
date:   2021-06-03
tags: ["docker", "feedback", "docker desktop", "macos"]
---

Story about me giving feedback to Docker.

## Docker

I’ve been using `docker` since 2014. It is hard to imagine nowadays development and deployment without the containers.

Using it on non-linux machines, especially on MacOS was always somewhat problematic. Running out of disk space, fans spinning like crazy, networking peculiarities.
Evolution of tooling and introduction of Docker Desktop improved things a lot. No more self-managed virtual machines, no more Vagrant provisioning. Start the desktop app and start using docker, magic.


## Docker Developer Preview Program

This year I gave in and finally bought my first personal laptop since 2010. Because I was using laptops from work for my personal stuff from time to time. But the magic of M1 silicon was too attractive to resist it.

With M1 came new problems, especially with `x86` and `arm64` images and ability to run Docker at all. But it didn't take long to roll out the first public betas for Developer Preview, so I decided to join this program.

I wanted to get new releases faster and  communicate M1 specific issues.
So I joined a [Docker Community Slack](dockercommunity.slack.com).

There is a small form to enroll into [Docker Developer Preview Program](https://www.docker.com/community/get-involved/developer-preview).
One of the questions is "What one feature would you add to Desktop?"

I realised that it would be nice to add Volume management and disk space management into the desktop app.

## The call

Few months later I received an email from [Dieu Cao](https://www.linkedin.com/in/dieucao/) who is a Senior Product Management Director at Docker, Inc.
She is interested in discussing the Volume Management I've written about in a feedback form.

This was a nice surprise and the first time any software vendor of this size came back to me. It feels good, when someone is interested in hearing feedback from you.

Zoom call consisted of several participants. Besides Dieu, I've got a chance to speak to [Djordje Lukic](https://www.linkedin.com/in/djordjelukic/) (Staff Software Engineer), [Usha Mandya](https://www.linkedin.com/in/ushamandya/) (Senior Technical Writer) and [Trung Nguyen](https://www.linkedin.com/in/trungutt/) (Software Engineer).


Although I didn't have much time to prepare for the call, I was able to describe my thoughts and pain points we have using Docker Desktop.
I mentioned that one of the bigger issues on MacOS is that disk space tends to disappear quite fast.
Not all IT staff in my company are tech-savvy and know how to fix issues. Like executing several CLI commands to free up space:

```sh
# analyse disk usage
docker system df -v
# clean what can be cleaned
docker system prune
# drop unused containers
docker ps -a | grep Exited | cut -d '\'' '\\'' -f 1 | xargs docker rm
# then a bit more with images
docker rmi $(docker images --filter "dangling=true" -q --no-trunc)
# and then even more
docker volume prune
```

And while you already can see images and containers in Desktop App, you can not do the same with Volumes. And volumes tend to grow in size, and in case of our application, we have a lot of those. So disk space ends fast.
Having this feature inside the app would make it much easier to manage and free-up space when it's needed.

I also mentioned that `compose` integration can be improved.
Our application consists of 25 services. Orchestrating them in the Desktop App is not always an easy task.
Sometimes you get `cannot execute docker-compose script` . Sometimes some Environment variables are missing or mounts are empty.

Dieu said that they've been working on Volume Management already. And they wanted to share it with me already to hear my feedback.
How awesome! This feature is due to be released next week, and I have an pleasure to review it and give feedback 😏

So I've got a chance to sneak peak new features in action, leave my comments and also learn something new for myself.
They described some extra functionality related to volumes that I'd never thought about before.

That was a surprisingly great experience for me, and I hope my feedback was helpful to guys and girls from Docker.

## Takeaways

Very positive experience and solid approach from the Docker team. Reaching out to the primary audience to discuss the major pain points is the right attitude.

I wish more companies would be that open and willing to accept ideas and suggestions.

<img src="/img/docker/zoom.png" alt="Zoom call" />

<img src="/img/docker/dev-preview-program.png" alt="Dev preview program" />
