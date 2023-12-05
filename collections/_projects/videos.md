---
title:  "Notes for Making Project Videos"
date:   2022-05-25 12:00:00 -0700
categories: research design
short_description: "Tools and advice"
block_color: "rgb(12, 82, 13)"
featured: false
has_article: true
permalink: making-project-videos/
---    

*Making videos to present research has become more common over the pandemic. These are my working notes on how to make good videos and advice on tools and workflow.*


<div class="full-width">
<figure class="almost-full-bleed">
<iframe class="video" src="https://www.youtube-nocookie.com/embed/SyTuuUbTFVU?rel=0" title="YouTube video player" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen="" frameborder="0"></iframe>
<figcaption><p>An HRI 2022 conference presentation video for <a href="https://wandering.nickwalker.us/"> a project</a>.</p></figcaption>
</figure>
</div>


## A video and a talk are different

When conferences went virtual, massive timezone differences across participants and video conferencing flakiness made it necessary to find some alternative to typical synchronous session format, where presenters would deliver slides one after the other. Many conferences decided to have presenters make pre-recorded videos that could be played and replayed at different times (or just put up for "attendees" to browse of their own accord). It's natural to think of these videos as simply pre-recorded *talks*, but the context for these formats is so different that it's best to think of them as a distinct form.

Interaction is key in talks. Even you aren't going to take questions in the middle of the presentation, you can sense the energy of the audience and adjust appropriately. You can work in a funny beat if the audience is falling asleep, or you can linger on a topic if you sense the interest. Talks are performance. You trade complete control of the presentation for the ability to respond on-the-fly. Socially, we understand that some compromise in the quality of the presentation is inherent to this compromise; no one expects a presenter to cover all of their material if the room takes them on a tangent, and we accept that presenters aren't professional speakers. They might have more "ums" and "uhs" than we'd prefer, but the value of the reactivity far outweighs issues from a lack of polish on average.

Videos are different. You have complete control and the format affords you zero interaction. The social balance is different. People are more critical of a video than they are of a talk because you had (as far as a viewer cares) unlimited opportunity to get it right. Unpreparedness is also considerably more permanent. 

## What makes a good video

A video needs to hold the viewer's attention in order to be watched. Many of the same things that would make for a good talk will make for a good video, but odds are stacked against you. People are watching on their phones or the computers with abundant available distractions and there are no room dynamics funneling their attention towards you.  Fortunately, you can carefully craft both what they're hearing and what they're seeing in a way that can be much more engaging than the same elements performed live.

## Workflow

* Draft a script. Budget according to 150 words per minute speaking rate. It should sound plain, simple and natural when you read it out loud. If the script sounds labored, remember that it's preferable to give less detail than to bore the viewer. What you say is core, and you won't easily make up for it later if the script isn't interesting on its own. 
  * This is a video script, not a talk script. Don't waste time introducing yourself or the name of your paper in detail, most of the people watching clicked on the title to begin with and they can read the description. Don't thank an imaginary audience. Don't verbally point at slides with deictic references.
* Draft a sequence of visuals. Just like slides of a good talk, these should complement and not compete with what you're saying.
  * To keep things lively, aim for visuals that evolve (even slightly) at least every 10 seconds. This isn't the burden that you might first think; you can make one graphic or slide with a few elements and build them in one by one in time with what you're saying.
* Iterate. The strength of the video format is the ability to closely coordinate visuals with what you say. Look for opportunities to give illuminating visual form to complex concepts. You want a steady rhythm of interest across both the script and the visuals. 
* Record the voiceover.
* Export all the visuals.
* Line them up and revise as necessary.


## Tools and tips

The ecosystem of media tools is more developed in macOS but you can probably find near substitutes with the same features in Windows.

* **Keynote**: Apple's presentation software has easy-to-use animation tools that make producing engaging visuals simple. It provides only rudimentary control over timing, and doesn't make it easy to achieve coordinated motion amongst multiple elements, but still manages to handle the vast majority of what you'd want to do.
  * Here's [what the build sequence for a slide in one of my videos looks like](/assets/projects/videos/keynote-builds.png). A typical slide is 3 to 4 "chunks" where multiple things happen at about the same time, and in each chunk there may be 2-20 individual elements that are animated. In order to look natural, it's important that elements that are animated together happen at slightly different speeds and with varying delays.
  * Magic Move, a special transition which interpolates the transforms of objects that are common between two slides, is the only [keyframe](https://en.wikipedia.org/wiki/Key_frame)-like affordance, but it's pretty good.
  * `File` > `Export To` > `Movie...`. Playback: Self-Playing. Select a small range of slides that you're happy with and export them at 1080p. Whatever settings you use for the "Go to next slide/build after" options, keep a note and use them consistently so you can reexport a clip later and maintain relative timing in the editing timeline.
* **[Keyshape](https://www.keyshapeapp.com/)**: If you **really** want to accomplish a complicated animation, I recommend this 3rd party app. It provides a keyframe timeline UI which will be familiar if you've used any other animation software. It's significantly lighter and cheaper than something like After Effects.
* **Premiere Pro**: In order to precisely line up audio and video, you'll need to bring them into a [non-linear editor](https://en.wikipedia.org/wiki/Non-linear_editing). Premiere is neither cheap nor easy to use, but I've needed to use it to [composite](https://en.wikipedia.org/wiki/Compositing) elements for my videos.
  * Here's [what the timeline for one of my videos looks like](/assets/projects/videos/premiere-timeline.png). This particular project didn't involve compositing, but it did involve actual video clips which were adjusted using Premiere's good color correction and video stabilization tools. Notice that there are on the order of 100 cuts. Many of these come from inserting hold frames in the exported Keynote animations to give the voiceover the time it needs to get to the next point.


<figure>
<iframe class="video" src="https://www.youtube-nocookie.com/embed/1j91ISstdH8?rel=0" title="YouTube video player" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen="" frameborder="0"></iframe>
<figcaption><p>An HRI 2020 conference presentation video for <a href="https://nickwalker.us/publications/walker2020perceptions"> another project</a>.</p></figcaption>
</figure>