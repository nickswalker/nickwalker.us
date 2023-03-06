---
title:  "Service Robot Command Understanding"
date:   2019-07-19 12:00:00 -0700
categories: research
short_description: "Data and models for going from language to executable form"
github_repo_url: "https://github.com/nickswalker/gpsr-command-understanding"
block_color: "#4994c3"
featured: true
has_article: true
published: true
layout: published_project_entry
featured_image: /assets/images/research/robot_command.jpg
citation_keys: [walker2019robocup]
---

{% include article_image.html img="/assets/images/research/robot_command.jpg"
    caption="Robots like the HSR are capable of many things, but it's still hard to build language interfaces that let users provide commands naturally."%}

## The Problem

One day, we'll have capable helper-robots like Rosie that can carry out a wide range of tasks.
Spoken commands would be a natural interface for these robots. 
Even though there's been a lot of visible progress in this realm (e.g. Smart Cylinders), it's still unclear how best to build systems that handle the unique aspects of robot commands like {% cite_details thomason2019icra --text resolving references to visual properties%} or {% cite_details jiang2019icaps --text references to unknown objects%}.

People have long recognized that this is the kind of domain where machine learning is essential; the mapping between a command and what should be done is a complicated interaction of language and elements of the robot's environment, something that is infeasible to specify by hand, and, maybe, something that we can only expect to accomplish with some amount of continuous learning in each deployed setting.
It's too bad then that there's so little language data available for robotics domains.
There is no deployed fleet of home service robots out there pumping logs and transcripts back to us-- we hardly have working robots in the lab. 
This hasn't stopped some researchers from building very capable robot language-understanding systems, they just generally take a lot of expertise and domain knowledge to set up.
**Most robotics research groups don't bother and opt for rigid language interfaces** instead.


The more robots in the world that attempt to implement genuine, naturalistic language interfaces, the more robots there
are collecting data that can help improve the quality of future systems. 
**Can we design approaches that are both powerful enough to understand a broad
range of commands, but also simple enough that they can be adopted by any robotics group?**

## What We Did

We rolled some recent progress in applying neural methods to the problem of converting language to logical representations (e.g. something that a robot's planner could actually take as input to produce an executable sequence of actions) into a system that strikes just this balance; we were able to understand a broad range of commands taken from the RoboCup@Home _General-Purpose Service Robot_ task, and the only expertise required was from someone familiar with the robot's preferred logical representation so that we could annotate training pairs of language and logical form.
We even show how you can use crowdsourcing to gather paraphrased versions of your training samples to get a useful scale of data quickly.

Now, these models aren't magical; like most machine-learned things, they can't be expected to generalize far out of their training distribution.
But again, the point is, unlike previous approaches, ours both works and has a hope of being adopted by people who don't want to invest the time in building a state of the art natural language system for their particular deployed setting.

Our hope is that we'll see some uptake of these methods amongst folks looking at the RoboCup@Home domain that we targeted, and that we can work together to collect more data that'll feed back into the research community.