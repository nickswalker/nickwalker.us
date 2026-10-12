---
title: "Your Robots Should Outlive You"
date: 2026-10-20 12:00 -0400
type: blog
categories: ["opinion"]
published: true
---

A humanoid robotics company recently earned some press coverage by having their old models [backflip](https://www.the-independent.com/tech/robot-suicide-humanoid-death-figure-b3060486.html) to their molten demise. On the one hand, effective marketing. Marketing is valuable. On the other, *what a waste*. Of materials, but also of the entire embodied effort to build and maintain those robots. It was multiple people’s jobs to design and program those things. What does it feel like for the most valuable use of your robot to be creating slag for internet points?

Think about the next few years; there are a lot of humanoid companies, and a lot of engineers working on new robots. Many of these companies are not going to survive. Lots of robots are being manufactured that could last for years, but will probably become useless a couple of months after their makers close shop. If you’re an engineer working on one of these, you should be nervous. You probably won’t get to watch your CEO shove robots off the back of a plane as they explain that this is the best way to protect intellectual property, because the company jet and the robots are going to be in liquidation.

How do we make sure those robots have long, useful lives? Here’s what you do, in order of effort:

1. Plan to let robot owners teleoperate their robots, from the start. Even with no further access, being able to control the robot opens up applications that could be valuable to someone out there. Would the economics of my haunted house concept, staffed completely by me remotely controlling decommissioned humanoids, work out at today’s prices? No. But you can imagine how that kind of adaptive reuse sets a value floor that’s higher than scrap pricing.

2. Plan for your robot to run developer code from the start. I understand that customers want ROI, not APIs. But *if* the platforms need to be repurposed, the first problem will be that no one else can program them for another purpose. Historically, the market for robot development platforms was the small set of universities and research groups that might buy one, and then break it in weird and annoying-to-support ways. Now though, there is a wider world of potential customers who can’t build leading-edge robot hardware, but might be able to make a business on top of such hardware (or are willing to pay to try). A couple dozen of your robots might let a startup test their idea much faster, provided they can get the right software hooks in.

3. Allow owners to root their robots, top to bottom. Plenty of robots are going to rely on cloud software somewhere, which means the thing might not even turn on a couple months after someone stops paying the AWS bills. There *must* be a way to get complete low-level access. Put it behind an extremely scary manual procedure if you must, perhaps involving jumpering connections deep in the robot’s bowels. Make it wipe the filesystem, except for `gasp.wav` which’ll play when it gets powered back up. As long as all of the motor buses are there, and all the peripheral MCUs can still be re-flashed, someone will figure it out. The internet got the Linux kernel running Apple Silicon-powered Macs, and all those do is read email. They’ll have the robot dancing again in a year or two.

4. Standardize actuators. The dozens of actuators in a basic humanoid are the bulk of the cost, and most of what someone might want to repurpose. Intense design pressures mean these are custom-designed and manufactured to suit particular robots. This is necessary, for now, but also a big obstacle for repurposing them for anything else. You can’t string together motors from two different manufacturers’ robots because power delivery and communications won’t be the same. Standardization *will happen* eventually, but maybe it could happen a little faster if, say, one or two market leaders made a point of picking a common protocol or even supplying their actuators to other companies.

Should none of the above pan out, but you’d like your robot to end up with people who may still be able to get value from it, you can find [the freight address for MIT CSAIL here](https://officesdirectory.mit.edu/computer-science-and-artificial-intelligence-laboratory) (weekday delivery only, please).

And if they *do* pan out, we will gladly accept a robot as a token of thanks.
