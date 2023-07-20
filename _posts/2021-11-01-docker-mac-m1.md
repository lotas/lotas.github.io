---
layout: post
title:  "Docker Desktop alternatives for Mac with M1 chips"
date:   2021-11-01
tags: ["docker", "mac", "arm", "m1"]
---

Docker Desktop is not the only way to run Docker on Mac with M1 chips (as of November 2021, updated July 2023).

Important thing to know and understand is that your docker images must have either aarch64 (arm64) or x86 (amd64) architecture.
Afaik, you can mix both to some extent, but only with Docker Desktop.

I experimented with alternatives, and they are quite nice to work with, but not everyone knows about them.


## [OrbStack](https://orbstack.dev/)

I've learned about [OrbStack](https://orbstack.dev/) in June 2023. It is a [similar to WSL2](https://docs.orbstack.dev/architecture) approach to run lightweight Linux virtual machine on M1 mac.
It integrates itself into command line and gives you both `docker` support and ability to run linux virtual machine.

You can use `orb` or `orbctl` to manage VMs, or use docker right away.

```sh
$ docker run -it -p 80:80 docker/getting-started
```

UI itself is minimalistic, yet powerful and extremely fast. It can ran 20+ [taskcluster](https://github.com/taskcluster/taskcluster) containers easily, and CPU usage is minimal, comparing to Docker Desktop.

> As of 2023 OrbStack is my favourite choice on M1/M2 Macs due to it's low footprint and speed.


## Multipass

Easiest way to launch Ubuntu VMs is by using [multipass](https://multipass.run/) from Canonicial.

Installation is trivial: `brew install --cask multipass`. After this you can create and run as many VMs as you want, provided you have enough CPU and memory.

List available VMs:

```sh
$ multipass ls

Name                    State             IPv4             Image
primary                 Stopped           --               Ubuntu 20.04 LTS
```

Primary should be installed by default, if not one can run `multipass launch --name primary --cpus 2 --mem 4G --disk 20G`.

If you see something like `Launch failed: Operation canceled` you can run according to [this comment](https://github.com/canonical/multipass/issues/2288#issuecomment-963583241):

```sh
sudo launchctl stop com.canonical.multipassd
sudo launchctl start com.canonical.multipassd
```

Controlling it's state is as easy as `multipass start`, `multipass stop`, to enter `multipass shell`.

Cool thing about it, is that can be used as a default linux environment for development, not just for Docker.

It mounts automatically your home folder to `/home/ubuntu/Home` using `sshfs`, so you can run commands inside, but edit files on the host machine.

To get docker up and running:

```sh
$ sudo apt update
$ sudo apt install -y docker.io docker-compose
# to be able to run docker without sudo
$ sudo usermod -aG docker $USER
```

After that you can go and run your containers as you did so far. If you want to do it from the host machine, you'd need to set up `docker context`.

On your host machine you should have `docker` binary either from Docker Desktop (which you don't need to start), from `brew`, or other source. Docker can fire commands against docker daemon that runs inside ubuntu machine. To do so, it needs ssh access inside the machine, it will need `ssh ubuntu@IP` (IP can be seen in `multipass ls` output).

Make sure to add your ssh key to the ubuntu machine, so you can access it from the host machine.

```sh
# on host
$ cat ~/.ssh/id_rsa.pub | pbcopy

# inside ubuntu vm
echo '<your_key>' >> ~/.ssh/authorized_keys
```

With that done, you can add docker context on your host machine

```sh
# Create context
$ docker context create multipass --docker "host=ssh://ubuntu@192.168.64.7"
# Switch to it
$ docker context use multipass
# Run container
$ docker run --rm -it alpine /bin/sh

# In case previous command fails with
# `exec user process caused: exec format error`, you'd need to specify platform:
$ docker run --rm -it --platform linux/arm64/8 alpine /bin/sh
```

As far as I understand, ports are not forwarded automatically, so you need to forward them manually, or just use vm IP instead of localhost, i.e: `http://192.168.64.7:5000`


```sh
$ time multipass start
multipass start  0.03s user 0.03s system 0% cpu 19.318 total

$ time mp stop
multipass stop  0.02s user 0.02s system 3% cpu 1.219 total
```

## [Lima](https://github.com/lima-vm/lima)

> Lima launches Linux virtual machines with automatic file sharing, port forwarding, and containerd.

Fast and lightweight, you are not limited to Ubuntu. Can be installed with `brew install lima`.

Similar workflow - create one or more VMs, and then run containers inside them, or just use them as a default linux environment.

```sh
# launch linux
$ limactl start

# shell into
$ lima
```

This will open an editor to specify the configuration for the new VM, like architecture, mounts, ports, etc.

There are plenty of [examples](https://github.com/lima-vm/lima/tree/master/examples) how to configure for different use-cases (k3s, k8s, alpine, centos, etc)

Can run x86 with qemu emulation, but is rather slow. While aarch64 feels like native.


```sh
$ time limactl start

limactl start  0.02s user 0.03s system 0% cpu 22.145 total

$ time limactl stop

limactl stop  0.01s user 0.02s system 3% cpu 1.069 total
```

###  [Podman machine](https://docs.podman.io/en/latest/markdown/podman-machine.1.html)

[Podman](https://docs.podman.io/en/latest/index.html) is a daemonless container runtime for Linux.

It claims to be a drop-in replacement for `docker`, but on Mac you obviously need an underlying linux VM running.

**Podman machine** is a tool to create and manage VMs for Podman. (This was introduced recently, as a replacement for `podman-machine`).
Naming, is hard... remember.

```sh
$ podman machine init
$ podman machine start
$ podman machine ssh # but you don't have to, you can stay on host and run `podman` as `docker
```

One thing to note is that you don't have a `docker-compose` equivalent, althought there is such thing as [podman-compose](https://github.com/containers/podman-compose). I believe this is because podman is trying to be closer to kubernetes and provides k8s compatible configs and `pods`.
You can create `pod`, and attach multiple containers to it, which will share fs, ports, etc. Pretty much as pod in k8s.

```sh
$ time podman machine start

podman machine start  0.02s user 0.03s system 0% cpu 14.526 total

$ time podman machine stop
time podman machine

podman machine stop  0.01s user 0.02s system 27% cpu 0.110 total
```

## [Docker desktop](https://www.docker.com/products/docker-desktop)

Yep, rather slow, compared to lima and multipass, but can run both x86 and aarch64 images simultaneously.

Upd 2023: Seems like Docker Desktop was seriously improved and provides significantly better performance,
also UI gives much more options now for monitoring, viewing files and seamlessly executing in containers.


## [UTM](https://mac.getutm.app/)

This is a GUI tool to run VM's on Mach. Not limited to linux, can run Windows as well.

You can launch favourite linux distro.

Personaly, I don't consider this as a good alternative, as you it provides less integrations with docker and command line.

