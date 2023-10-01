---
layout: post
title: "TIL: Prometheus Conference Berlin 2023"
date: 2023-09-30
tags: ["til", "prometheus", "grafana"]
---

I didn't attend [PromCon Berlin 2023](https://promcon.io/2023-berlin/) in person, but I watched [streams on the youtube](https://www.youtube.com/watch?v=pKYhMTJgJUU).

Below are some new (for me) things, that are worth noting:

- [Perses](https://github.com/perses/perses) is a dashboard for Prometheus (and later other sources) metrics
- [OpenTelemetry](https://opentelemetry.io/) is a standard for metrics, traces and logs
- [Beyla](https://github.com/grafana/beyla) automated application metrics with eBPF and Prometheus (more below)
- [Kepler](https://sustainable-computing.io/) Kubernetes Efficient Power Level Exporter
- [Platypus](https://platypusattack.com/) attack. Power-side channel attacks on Intel CPUs. Guessing CPU instructions and operands by their memory consumption, and ability to extract crypto keys
- [Cloud Carbon Footprint](https://github.com/cloud-carbon-footprint/cloud-carbon-footprint) tool to estimate energy use and carbon emissions from public cloud usage
- [CNCF Mentoring Initiatives](https://github.com/cncf/mentoring) if anyone wants to do contribute and need help
- [Autometrics](https://github.com/autometrics-dev) add SLOs like success rate, latency, attach to your code and let it do the restore

Few takeaways:

- create a tool (prometheus) and everyone would try to find an application for it, even if it is not always the right tool. Common issue.- create a tool and everyone would build 100x more tools around it. No wonder it's so hard to figure out what's good
- measuring code metrics from inside the code is not right, as it doesn't include kernel, IO, network timing and client side issues


## Beyla

Grafana's [beyla](https://github.com/grafana/beyla) is a "eBPF-based auto-instrumentation of HTTP and HTTPS services"

This is a quite novel and interesting approach to collect metrics from code without even touching the code. It does so by using [eBPF](https://ebpf.io/).
My understanding of eBPF is that it is a set of kernel calls that allow user-space applications to get notified on various events that are happening inside kernel. For example listen to all `tcp_connect` calls.
It is also language  (and version) specific though, intercepting those calls alone is not enough, you need to know memory layout to get list of arguments and context of that call.

Beyla mainly supports GO code and some generic HTTP, HTTPS calls for other languages and can provide basic RED metrics (Request, Errors, Duration)

It can send later all this events to prometheus directly.
User-space monitoring program requires `CAP_SYS_ADMIN` privileges.


## GreenOps

It is really hard to measure impact of data centers, and cloud services provide limited carbon monitoring.

[Kepler](https://sustainable-computing.io/) Kubernetes-based Efficient Power Level Exporter. It uses RAPL (Intel-based Running Average Power Limit) feature that reports energy consumption. Which later uses eBPF to attribute power usage to process and then to pod. So you could later aggregate by namespace/deployment/service.

Downside is that RAPL not accessible in VMs and is the source of fantastic vulnerability discovered in [Platypus](https://platypusattack.com/) attack.

Platypus attack is a brilliant and creative way to sample power usage and associate it with unique processor instruction (different instructions consume different amount of power). It does also allow to get the Hamming distance of its operands (number of non-zero bits). Having this info it is "really easy" to extract information like crypto keys from memory. Crazy.

If you want to measure your impact you could use [Cloud Carbon Footprint](https://www.cloudcarbonfootprint.org/) to get those estimates.
Here's [demo](https://demo.cloudcarbonfootprint.org/)

## Autometrics

[Autometrics](https://github.com/autometrics-dev) look interesting too. It is a micro-framework which uses decorators to wrap code and extract metrics automatically.
[Spec here](https://github.com/autometrics-dev/autometrics-shared/blob/main/SPEC.md)

What I find interesting is that it allows to provide objectives (SLOs) in form of success rate, latency. Besides that, it generates promql queries to query those metrics in provided Grafana dashboards.

"Auto" in name might be misleading, because it still requires adding a library, making changes to code and providing a config.
