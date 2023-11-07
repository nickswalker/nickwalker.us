---
title: "Any AI that writes about people needs an opt-out button"
date: 2023-11-06 12:00 -0600
type: blog
categories: research
published: false
---

I am five years into fix my profile on Semantic Scholar. It's never been a pressing activity, just something I would think to try every so often. But it's taken on a new urgency as I'm approaching graduation.

See, Semantic Scholar is an academic search engine, which some people may use to try to find out more about me or my work. This is a problem because, in the six years that I recall looking, **there has never been a point where my Semantic Scholar page has accurately depicted my publication record**. 

Early on, it included articles from other Nick Walkers. These kinds of errors are typical. Like Google Scholar and other large scale indices, Semantic Scholar crawls, collects and munges data of various quality, and essentially [has to guess](https://arxiv.org/pdf/2103.07534.pdf) how many Nick Walkers there are and how to assign papers to them. While _you_ can tell that [a paper]({% details_link jiang2019icaps %}) about service robots is unlikely to come from a [synthetic aperture radar expert](https://ieeexplore.ieee.org/author/38181749600), or a [British professor of chemistry](https://www.ncl.ac.uk/nes/people/profile/nickwalker.html), the technology of 2019 was not up to the task. After failing to correct the issue myself with their limited tools, I eventually emailed support, and they fixed enough of the problem for me to stop trying. 

The latest issue is more pernicious.

In recent years I noticed that I've had two profiles, [a "verified" one](https://www.semanticscholar.org/author/Nick-Walker/145314605) which includes four publications, and [another](https://www.semanticscholar.org/author/Nick-Walker/8257289) which includes the rest. This abbreviated profile is attached to the papers that show up first in most search results for my name. It's likely that its verification is somehow a result of my flailing to fix the previous issues.

My emails to support over the past couple months haven't led to the issue being fixed, and there is no other means of recourse. What happens when you send the email? I'm not sure, but based on my observation, support staff approve the request, then file a polite suggestion to some machine learning pipeline which proceeds to do jack all with it.

-------------

This harm[^1] is small, but it comes in the [same pattern](https://en.wikipedia.org/wiki/Externality) by which many greater harms have come to pass. A technology enables something new, something which would've traditionally required unimaginable human effort. The technology is pushed to its limit and becomes enmeshed in the creation of value. It's only after this point---due to a lack of critical evaluation[^2] at any stage prior---that a litany of issues arises, issues which can only reliably be resolved with...an unimaginable amount of human effort. This is how even well-intentioned firms find themselves funneling their profits into the sisyphean task of [unwinding the harms wrought by their own success](https://www.theverge.com/2019/2/25/18229714/cognizant-facebook-content-moderator-interviews-trauma-working-conditions-arizona).

Any AI system empowered to publicly characterize a person _must_ allow that person to opt out entirely. The stakes here are low, so I'd argue this is the bare minimum concession any platform should be required to make[^4]. If such a feature were easily implementable for Semantic Scholar, I would likely not have had issues with the platform in the first place. But I am raising the bar[^3] to the provision of a guarantee that I not be conscripted for the correction of future problems.

{%-- I understand that Semantic Scholar cannot easily implement this black-holing because it cannot reliably distinguish who I am.  --%}

I suspect that, if Semantic Scholar were to pursue this path, they'd discover what Google Scholar has long understood; it's simpler to create profile pages only for users who want them, as they can then be relied upon to contribute to curation. But the resulting sparse graph of author profiles would cut against the utility of their platform. So we're left to gripe, and, along with some support staff, push rocks.

[^1]: I have not interacted with anyone who treats Semantic Scholar as a source of truth. But I worry that, [somewhere](https://blog.allenai.org/conference-peer-review-with-the-semantic-scholar-api-24ab9fce2324), they exist.

[^2]: In an unusual twist for an institute set up in ["service of the common good"](https://allenai.org/about), AI2 has, in the past, adopted a deliberately _uncritical_ perspective about the problems with Semantic Scholar. Noah Smith, [responding](https://twitter.com/nlpnoah/status/1194836101241831424) to another dissatisfied user four years ago:

    > I'm not sure where you think this responsibility for "quality control" comes from.  Any system this large will involve automation.  Anyone who understands automation understands there will be mistakes and improving quality is a continuous process.  Don't like it?  Don't use it.

    I am reminded of [another group of blithe technologists](https://www.scientificamerican.com/article/exxon-knew-about-climate-change-almost-40-years-ago/).

[^3]: [dblp](https://dblp.org/) disambiguated my profile in 2019 within a day of my asking. There haven't been any mistakes since, perhaps because they defer to standard [ORCiD](https://orcid.org/) identifiers wherever possible.

[^4]: See the White House's ["Blueprint for an AI Bill of Rights"](https://www.whitehouse.gov/wp-content/uploads/2022/10/Blueprint-for-an-AI-Bill-of-Rights.pdf) for a more expansive expression of the same view. 