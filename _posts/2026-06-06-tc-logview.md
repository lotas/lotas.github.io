---
layout: post
title: "tc-logview, and the invisible work behind small tools"
date: 2026-06-02
tags: [taskcluster, firefox-ci, debugging, observability, agentic coding, security, gcp]
---

Some tools look like they were vibe-coded in an afternoon. [`tc-logview`](https://github.com/taskcluster/tc-logview) could be seen as one of them: a small interface for searching and exploring [Taskcluster](https://github.com/taskcluster/taskcluster) and [Firefox-CI](https://firefox-ci-tc.services.mozilla.com/) logs - the thing you reach for when something breaks and you need to know why. The implementation is small. What isn't small is everything that had to happen before it could exist.

For me that's closer to four years of debugging Taskcluster in production - opening GCP Logs Explorer, saving filters, comparing worker-manager behavior across pools, chasing provisioning failures, building dashboards, exporting metrics, and writing throwaway Python and Jupyter notebooks to automate the investigations that were too repetitive or too subtle to redo by hand every time.

## The questions, not the logs

Over the years that turned into a mental model of how Taskcluster behaves when something goes wrong. Not just *where* to look, but which question to ask next:

> Was this worker never created, or created and then unable to claim work?<br/>
> Did worker-manager decide not to provision it, or did the cloud provider reject the request?<br/>
> Is this one failing task, one pool, one region - or a broader incident?<br/>
> Is the system broken, slow, misconfigured, rate-limited, or behaving exactly as designed?

Taskcluster is a distributed system with a lot of moving parts - queue, auth, worker-manager, cloud worker, hardware workers, hooks, GitHub integration, secrets, object service and some more. A single user-visible failure can span several of them. Logs only help once you can connect them to the right question, and for a long time asking the right question meant knowing which logs existed, which fields mattered, and how to chain events across services. That knowledge lived in dashboards, in saved GCP filters, in notebooks - and mostly in my head.

A debugging workflow that lives in one person's head doesn't scale. It creates **hidden ownership**: the next person to hit the same issue has to rediscover the path, or wait for the one who already knows where to look. `tc-logview` is my attempt to package that experience into something the rest of the team - RelOps, RelEng, Taskcluster maintainers - can use without first spending years accumulating the same context.

## It speaks Taskcluster, not just logs

The part that makes `tc-logview` more than a nicer search box: it isn't a generic log grep. It knows the shape of Taskcluster's logs.

Taskcluster services emit structured logs with declared types, and each service publishes those definitions as a schema, for example [worker-manager logs](https://firefox-ci-tc.services.mozilla.com/references/references/worker-manager/v1/logs.json). The `sync` step fetches them - [one file per service](https://firefox-ci-tc.services.mozilla.com/references/references/) - so the tool knows which service emits which log type (`worker-stopped`, `task-claimed`, `hook-fire`, `monitor.error`) and what fields each one carries.

So instead of hand-writing a GCP `jsonPayload` filter, you ask for a type and filter on its fields. First, see what a service can emit:

```console
$ tc-logview list --service worker-manager

SERVICE         TYPE                        LEVEL    FIELDS
worker-manager  worker-requested            notice   providerId, terminateAfter, workerGroup, workerId, workerPoolId
worker-manager  worker-running              notice   providerId, registrationDuration, workerId, workerPoolId
worker-manager  worker-stopped              notice   providerId, runningDuration, workerAge, workerId, workerPoolId
worker-manager  worker-removed              notice   providerId, reason, runningDuration, workerAge, workerId, workerPoolId
worker-manager  registration-error-warning  warning  error, message, providerId, workerId, workerPoolId
worker-manager  monitor.error               any      message, name, stack
...
33 log types
```

Then query one of those types and filter on a field. The tool expands that into the underlying GCP filter - the `jsonPayload` paths, the service name, the time window:

```console
$ tc-logview query -e fx-ci --type worker-stopped --where workerPoolId="gecko-t/t-linux-docker-amd"

Filter: resource.labels.cluster_name="webservices-high-prod" AND resource.labels.namespace_name="taskcluster-prod" AND jsonPayload.Type="worker-stopped" AND jsonPayload.serviceContext.service="worker-manager" AND jsonPayload.Fields.workerPoolId=gecko-t/t-linux-docker-amd AND timestamp>="2026-06-06T07:53:00Z" AND timestamp<="2026-06-06T08:53:00Z"

TIMESTAMP             SERVICE         PROVIDER_ID      RUNNING_DURATION  WORKER_AGE  WORKER_ID            WORKER_POOL_ID
2026-06-06T08:26:59Z  worker-manager  fxci-level1-gcp  684.994           735.383     7973378544901187612  gecko-t/t-linux-docker-amd
2026-06-06T08:32:17Z  worker-manager  fxci-level1-gcp  1983.631          2034.615    3914679929589886449  gecko-t/t-linux-docker-amd
2026-06-06T08:36:08Z  worker-manager  fxci-level1-gcp  479.527           530.656     6857293518798219018  gecko-t/t-linux-docker-amd
...
100 entries
```

The same shape pulls recent errors across services:

```console
$ tc-logview query -e fx-ci --type monitor.error --since 1h --limit=5

Filter: resource.labels.cluster_name="webservices-high-prod" AND resource.labels.namespace_name="taskcluster-prod" AND jsonPayload.Type="monitor.error" AND timestamp>="2026-06-06T07:54:00Z" AND timestamp<="2026-06-06T08:54:00Z"
Time: 2026-06-06T07:54:00Z to 2026-06-06T08:54:00Z

TIMESTAMP             SERVICE         MESSAGE
2026-06-06T08:29:48Z  worker-manager  checkWorker timed out for gecko-t/t-linux-docker-noscratch-amd/2760291242679887762
2026-06-06T08:31:33Z  worker-manager  checkWorker timed out for gecko-t/win11-64-25h2/vm-nxybnlvar2yxkrvhid7tbadqueqajriqdq4
2026-06-06T08:38:36Z  worker-manager  checkWorker timed out for gecko-t/t-linux-docker-noscratch-amd/7168255301421786519
2026-06-06T08:43:41Z  github          Internal error, unknown error code: InternalError
2026-06-06T08:52:52Z  worker-manager  checkWorker timed out for gecko-t/t-linux-docker-noscratch-amd/2362626405496154022

5 entries
```

Without the schema, "search the logs" means already knowing the field names, which service emits them, and the filter syntax - the stuff that used to live in my saved filters and my head. It's also what lets an agent use it: it isn't guessing field names, it's reading from the same definitions the services publish.

Good debugging is rarely a single search anyway. It's iteration: ask, inspect, refine, narrow - until the system makes sense. That loop is also what an AI agent is good at, which is why the last few weeks went into making that access safe.

## Least privilege, by default

Giving humans and agents a shared window into production logs is useful. It's also a great way to hurt yourself if you're careless about access.

I don't want a debugging tool to hold broad credentials. An agent with high-privilege access is one prompt injection or one careless moment away from a very bad day - and we read about exactly those days constantly: dropped production databases, deleted VMs, wiped backups. The blast radius of a log viewer should be simple: it can read logs. Nothing else.

`tc-logview` supports the standard `gcloud auth application-default login` flow for everyday human use, plus access-token **impersonation** that hands the tool a narrowly scoped, short-lived identity - read-only, logs only. Whoever (or whatever) is driving it can read what they need to debug, and is structurally unable to touch anything else.

This is the same instinct I wrote about when I [deleted my WakaTime account](/2026/06/01/leaving-wakatime): tools should behave predictably and stay in their lane, and agents should run with the smallest blast radius you can give them. Read-only logs is a comfortable lane.

## Where it shines: incidents and investigations

The day-to-day use is handy, but the tool really proves itself during incidents.

Most of the time that's a technical failure: something broke and you need the root cause - which worker, which pool, which error. That's what the saved queries are for.

It is also a valuable tool for security audits. A report comes in that one of our services could allow remote code execution. You patch it, but then there's a harder question: was it abused? That means going back through the logs and accounting for every attempt - who, when, and whether anyone got further than the proof-of-concept in the report.

This is slow, careful work, and an agent driving a read-only log tool turns out to be good at it. You point it at the time window and it does the searching: every request matching the vulnerable path, grouped by source, checked against the report. In our case it came back clean - the only attempts were from the researcher who reported it. By hand it would have taken a lot longer, right when you don't want to be slow.

It's the same ask-inspect-refine loop, just under pressure - and the read-only credentials are what make it OK to let an agent loose in production logs while it runs.

## The selfish part: being asked less

There's a selfish reason too, and it's the main driver for me.

When you're the only person who can read production logs, everyone comes to you. It feels good at first, then it just eats your time - and nothing gets looked at while you're asleep or on holiday.

So a big part of building `tc-logview` was handing that off. If a teammate can run the same query I would, they don't have to wait for me, and I don't have to drop what I'm doing to look. It worked - people ask me to dig through logs far less than they used to, and a few other teams picked it up for their own work too.

## What I actually learned

The code was quick to write. What took years was the investigating behind it - the manual, one-incident-at-a-time kind - slowly building up a sense of which log to check first and what "normal" even looks like.

Finally this no longer lives only in my head. The investigation paths are written down as [a small library of skills](https://github.com/taskcluster/tc-logview/tree/main/.claude/skills/debug-tc-logs/examples) that ship with the tool - [debugging the Azure provider](https://github.com/taskcluster/tc-logview/blob/main/.claude/skills/debug-tc-logs/examples/azure-provider-debugging.md), [chasing down a task failure](https://github.com/taskcluster/tc-logview/blob/main/.claude/skills/debug-tc-logs/examples/task-failure-debugging.md), tracking down [the 502s I wrote about here](/2024/03/15/gcp-load-balancer-502s), queue health, worker removals - step by step, with the queries to run and the thresholds that should worry you. A teammate can follow them, and so can an agent.

I moved it into the Taskcluster org in H1 2026, and people use it on real incidents now. It has never fixed a bug on its own. But when a distributed system breaks, the fix is usually the easy part - the hard part is working out what actually happened, and that's what all of this is for.
