---
title: "Any AI that writes about real people needs an opt-out button"
date: 2023-11-06 12:00 -0600
type: blog
categories: research
published: true
---

I have spent five years attempting to fix my page on Semantic Scholar. It's never been a pressing activity, just something I would think to try after putting out a paper every so often.

But it's taken on a new urgency as I'm approaching graduation.

See, Semantic Scholar is an academic search engine, which some people may use to try to find out more about me or my work. This is a problem because, in the six years that I recall looking, **there has never been a point where my Semantic Scholar page has accurately depicted my publication record**. Early on, it included articles from other Nick Walkers who all had much more expertise in genetics than I do. At various times, publications would be orphaned onto new profiles. These kinds of errors are typical. Like Google Scholar and other large scale indices, Semantic Scholar crawls, collects and munges data of various quality, and essentially has to guess how many Nick Walkers there are and how to assign papers to them. While _you_ can tell that a paper about planning and scheduling for service robots is unlikely to come from a postdoc in physics, or a professor of chemistry in the UK (who uses their middle initial, probably to avoid such mixups), the technology of 2019 apparently was not up to the task. After trying and failing to use their page-claiming process for a year, I eventually emailed support and they patched the situation enough for me to stop trying for a time.

The latest issue is more pernicious.

In recent years I noticed that I've had two profiles, a "verified" one which includes four publications, and another which includes the rest. This abbreviated profile is attached to the papers that show up first in most search results for my name. I'm not sure how the profile was verified. It's likely that I did it or caused it to happen while flailing to fix the previous issues. Nevertheless, there's a "verified" profile which is incorrect.

I haven't yet succeeded in getting support to merge these profiles in my tries this summer and autumn. Sending them email is the recommended and only means of merging profiles. What happens when you send the email? I'm not sure, but based on my observation, support staff approve the request, then file a polite suggestion to some machine learning pipeline which proceeds to do jack all.

-------------

This harm[^1] is small, but comes in the [same pattern](https://en.wikipedia.org/wiki/Externality) by which many greater harms have and will come to pass. A technology, entity aggregation models in this case, is enabling something new, something which would've traditionally required unimaginable human effort. The technology is pushed to its limit and becomes enmeshed in the creation of value. It's only after this point---due to a lack of critical evaluation[^2] at any stage prior---that a litany of issues arises, issues which can only reliably be resolved with...an unimaginable amount of human effort. This is how even well-intentioned firms find themselves funneling their profits into the sisyphean task of [unwinding the harms wrought by their own success](https://www.theverge.com/2019/2/25/18229714/cognizant-facebook-content-moderator-interviews-trauma-working-conditions-arizona).

--------------

Any place an AI is empowered to publicly characterize a person, there _must_ be a way for that person to opt out entirely. The opportunity to fix mistakes before or after the fact is insufficient. It has to be a permanent veto. 

I understand that Semantic Scholar cannot easily implement this black-holing, because it cannot reliably distinguish who I am and would inevitably consume countless other hapless Nicks and Nicholases. I understand that what I'm asking would entail the correction of the problem I am currently facing. I am raising the bar off the floor[^3] to ask that I never be involved in the manual correction of future problems too.

I suspect that, if Semantic Scholar were to pursue this path, they'd discover what Google Scholar has understood to be true for the entirety of its operation; it's simpler and cheaper to only create profile pages when users opt-in, as they can then be relied upon to contribute to curation (modulo spam). That would leave a hopelessly incomplete graph of author pages, which would probably cut against the utility of their platform. So we're left to gripe, and, along with some support staff, are stuck pushing rocks.

[^1]: I have never interacted with anyone who treats Semantic Scholar as a source of truth. But I worry that, somewhere, they exist.

[^2]: In an unusual twist, for an institute whose [mission](https://allenai.org/about) is to "contribute to humanity," it seems like AI2 adopts a deliberately _uncritical_ perspective about the problems with Semantic Scholar. Noah Smith, [responding](https://twitter.com/nlpnoah/status/1194836101241831424) to another dissatisfied user:

    > I'm not sure where you think this responsibility for "quality control" comes from.  Any system this large will involve automation.  Anyone who understands automation understands there will be mistakes and improving quality is a continuous process.  Don't like it?  Don't use it.

    I am reminded of another group of technologists for whom a [similar active ignorance](https://www.scientificamerican.com/article/exxon-knew-about-climate-change-almost-40-years-ago/) was fruitful.

[^3]: When I asked [dbpl](https://dblp.org/) to disambiguate my profile in 2019, they fixed it within 24 hours. There haven't been any mistakes since, likely because they linked my profile to my [ORCID](https://orcid.org/) identifier, something which most publishers ask from authors these days.
