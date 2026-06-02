---
layout: post
title: "Twelve years of WakaTime — and why I just deleted my account"
date: 2026-06-01
tags: [wakatime, privacy, tooling, agentic coding, zed]
---

For about a decade, WakaTime quietly counted the hours I spent in my editor. This
morning I exported all of it and deleted my account. Here's the full picture — and
why I left.

A caveat up front: the dashboard below says **12 years**, but that's only how long
WakaTime was watching. I wrote my first real code around **2005** — the FTP-the-PHP-
straight-to-prod era — so the honest number is closer to twenty. Time-tracking just
didn't start logging until 2015.

## How I got into it

I installed the WakaTime plugin in the early days, around 2015. I even met **Alan**,
the author, one evening at a hackerspace in Kreuzberg whose name I've long since
forgotten. I was genuinely curious how a plugin could track coding time *reliably*,
and he walked me through it: **heartbeats**, **timeouts**, and a pile of **heuristics**
that turn a stream of keystrokes into "you coded for 1h 46m." I thought it was clever.
It served me well for years.

## The shape of the work changed

When Zed came out I switched over almost immediately. The WakaTime plugin took a few
months to catch up, so there's a gap with no data around that time. But by the time it
landed, something bigger had shifted: like a lot of people, I'd moved most of my work to
**agentic coding**. I type less and direct, review, and wait more. "How many hours did I
sit in the editor" stopped meaning much. The metric and the work had quietly drifted
apart.

## Software should stay in its lane

What actually nudged me out was smaller and more about principle. At some point the
plugin started picking up activity from my **AI agents** — Codex and Claude sessions —
and I never opted into that. There are config options for it, and I did turn it off; this
isn't a bug report, and I'm not pointing fingers. The part that bothered me is that it
happened *at all*, without my consent. Agentic scraping just… started.

I have a simple rule for tools I install: behave predictably and stay in your lane. The
moment something starts doing surprising things — reaching into corners I never pointed it
at — I either isolate it or get rid of it.

It's the same instinct that has me running agents inside tightly sandboxed containers:
each project in its own box, the agent able to read the current project and nothing else.
One rogue agent can't uninstall, delete, or wipe anything beyond its sandbox. (Short of
some theoretical Docker host-escape zero-day — but that's a different threat model.)

So I did the consistent thing: exported everything (genuinely grateful that's easy and
complete) and deleted the account. Not as punishment — just housekeeping.

## So, no more time tracking

I'm not keeping a coding-time tracker anymore — not out of anger, it just doesn't fit
the work. The hours no longer describe what the job actually is. Still, twelve years is
twelve years, and I'm glad I kept the record.

Here it is, project names anonymized. Built from the raw export with a little script;
everything's aggregated locally, nothing phones home.

{% include wakatime-dashboard.html %}
