---
layout: post
title:  "My done is done done"
date:   2021-06-10
tags: ["scrum", "definition of done", "development", "thoughts", "it"]
---

It is difficult to imagine an IT company nowadays that doesn't speak scrums.
Every job description you read, every company you talk to will tell you that they are doing "sprints" and that they are "mostly agile".

And unless you work alone or in a very small group, chances are you have a lot of participants. Each feature will go through the hands of a bunch of people during its lifetime. Let's take this example:

#### The flow

**Stakeholders** or business will come up with feature idea<br>
**Product owner** or **project manager** will gather all requirements and will come up with development/release plan<br>
**UX/UI expert** will do analysis and initial design based on the requirements they have<br>
**Developers** will take the requirements, prototype, design and will work on a feature, deploy it to a staging environment<br>
**Different developers** would normally do a code review of the introduced changes<br>
**QA** will check if feature works according to initial requirements and UX rules<br>
**Developers** will fix the bugs would there be any<br>
**Product owner** together with **stakeholders** will do their **business acceptance**<br>
**Someone** (developer, release manager, lead dev) will release this feature to prod<br>
Plus ideally providing all features with full test coverage - unit/integration/e2e tests

This is a more or less happy flow for small features that don't have many dependencies and don't need to be broken down into smaller features. This is also a scenario where **developers** are cross-functional and can do everything (backend/frontend/devops) without making this process even more complicated. Developing complex features usually takes more teams, more coordination between those teams and more communication. I will leave it out for now.

#### My done is done done

Now if you ask participants, what they think when they are **done**, you would probably hear many different things:<br/>
_"I finished working on mockups and design, I'm **done**"_<br/>
_"I'm **done** with development of this feature"_,<br/>
_"I'm **done** testing, sent it back to developers"_,<br/>
_"I'm **done** reviewing the ticket"_,<br/>

And it is kinda normal nowadays. Projects are big, there are many features to work on, constant time pressure, etc, etc. Often it comes down to **fire and forget** scenarios.

#### Problems

This kind of attitude often results in:

- too many features are developed at the same time (different participants)
- features rarily meet deadlines
- tickets are being underestimated
- lack of understanding the scope of the ticket
- missed sprint goals
- slow development/release pace
- forgotten/abandoned merge requests or PRs that stay "forever" in open state

#### Definition of done

For most of the features definition of done will look like the **flow** above. The final **done** would be a release to prod and closing of the ticket.

Each team member should:

- have a clear understanding of what **done** is
- be responsible for the success of the whole team
- be able to follow feature through all steps
- be able to communicate problems

Of course, different members may join at different stages of feature development lifecycle. But it is still important to communicate goals, deadlines and requirements well enough that everybody could understand what their role is.

In **ideal** flow no one will say _"it's done"_ until feature is released and ticket is closed.
