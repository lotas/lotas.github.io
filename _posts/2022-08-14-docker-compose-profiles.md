---
layout: post
title:  "Docker compose profiles"
date:   2022-08-14
tags: ["docker", "compose"]
---

## So you have too many (micro-) services..

It is quite common to have [docker compose](https://docs.docker.com/compose/) for your local development. Sometimes even for production. But as your project grows you have more and more services and containers. It takes a lot of resources to run them at once.

To prevent docker compose from starting all services, you can use [service profiles](https://docs.docker.com/compose/profiles/) for this.

Official [documentation](https://docs.docker.com/compose/profiles/) contains some examples, but I will provide another real-world example below.

## Yet another web app example

Let's say our application consists of the frontend application, backend API, database, two background workers and one cronjob:

```yaml
services:
  db:
    image: postgres

  frontend:
    image: your-app/frontend

  backend:
    image: your-app/backend
    command: api

  backend-worker-1:
    image: your-app/backend
    command: worker-1

  backend-worker-2:
    image: your-app/backend
    command: worker-2

  cronjob:
    image: your-app/backend
    command: cronjob
```

So if you run `docker compose up -d` now, it will start all 6 services at once. Quite possible, you only wanted to start backend and frontend.

You can introduce profiles for the services that don't need to start:

```patch
  backend-worker-1:
    image: your-app/backend
    command: worker-1
++  profiles: ["backend", "worker"]

  backend-worker-2:
    image: your-app/backend
    command: worker-2
++  profiles: ["backend", "worker"]

  cronjob:
    image: your-app/backend
    command: cronjob
++  profiles: ["backend", "cron"]
```

With those changes when you run `docker compose up -d`, those extra services will no longer start. Only `db`, `frontend`, `backend` will.

If you want to run those services, you have three options:

1. `docker compose up -d backend-worker-2` this will auto-enable profile and start specific service
2. `docker compose --profile worker up -d` will start both workers, as both of them have this profile. Keep in mind, profile argument is positional, you cannot use it after `up` command.
3. `COMPOSE_PROFILES=backend docker compose up -d` will start all backend workers and cronjob using env var.

I've noticed that second approach is quite tedious. You need to remember which profile you used. This will be a problem once you try to stop all containers with `docker compose down` and you will notice that those extra workers didn't stop.

> Note: if you use networks, you might additionally see this error: `failed to remove network network_name: Error response from daemon: error while removing network: network network_name id f3f6e7fc5 has active endpoints`.
>
> This is because `down` command didn't know about those extra profiles. To solve this you need to call it with exactly same profile names: `docker compose --profile worker down`.

And with environmental variable you can do:

```sh
export COMPOSE_PROFILES=backend
docker compose up -d # will start all
# ...
docker compose down  # this will stop all according to COMPOSE_PROFILES
```

Of course, this only works in the same terminal session, or if you have this variable set globally.

---

We started using profiles in my current project - [Taskcluster](https://github.com/taskcluster/taskcluster) because of the big amount of services.

Currently Taskcluster's [docker-compose.yml](https://github.com/taskcluster/taskcluster/blob/main/docker-compose.yml) defines more than 50 services, most of which are periodic cronjobs or background workers that are not needed during local development.
