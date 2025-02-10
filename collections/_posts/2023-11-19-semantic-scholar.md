---
title: "Any AI that writes about people needs an opt-out button"
date: 2023-11-19 12:00 -0600
type: blog
categories: blog
published: true
---

In my five years of sporadic checking, there has never been a point where Semantic Scholar has accurately depicted my publication record. 

Early on, it included articles from other Nick Walkers. These kinds of errors are typical. Like Google Scholar and other large scale indices, Semantic Scholar crawls, collects and munges data of various quality, and essentially [has to guess](https://arxiv.org/pdf/2103.07534.pdf) how many Nick Walkers there are and how to assign papers to them. While _you_ can tell that [a paper]({% details_link jiang2019icaps %}) about service robots is unlikely to come from a [synthetic aperture radar expert](https://ieeexplore.ieee.org/author/38181749600), or a [British professor of chemistry](https://www.ncl.ac.uk/nes/people/profile/nickwalker.html), the technology of 2019 was not up to the task. After failing to correct the issue myself with their limited tools, I eventually emailed support, and they fixed enough of the problem for me to stop trying.

The latest issue is more pernicious. In recent years I've had two profiles, [a "verified" one](https://www.semanticscholar.org/author/Nick-Walker/145314605) which includes four publications, and [another](https://www.semanticscholar.org/author/Nick-Walker/8257289) which includes the rest. This abbreviated profile is attached to the papers that show up first in most search results for my name. It's likely that its verification is somehow a result of my flailing to fix the previous issues.

{% include article_multiimage.html images="/assets/images/posts/semantic-scholar-profile-1.png /assets/images/posts/semantic-scholar-profile-2.png" caption="My two profiles on Semantic Scholar on November 7th, 2023." %}


My emails to support over the past couple months haven't led to the issue being fixed, and there is no other means of recourse. What happens when you send the email? I'm not sure, but based on my observation, support staff approve the request, then file a polite suggestion to some machine learning pipeline which proceeds to do jack all with it.

> Update 2023-12-20: The two profiles have been merged, likely as a result of internal escalation after emailing this post to the team. There remains no way to opt out of having a profile.

-------------

This harm[^1] is small, but it comes [from the same mold](https://en.wikipedia.org/wiki/Externality) of many greater harms. A technology enables something new, something which would've traditionally required unimaginable human effort. The technology is pushed to its limit and becomes enmeshed in the creation of value. It's only after this point---due to a lack of earlier critical evaluation[^2]---that a litany of issues arises, issues which can only reliably be resolved with...an unimaginable amount of human effort. This is how even well-intentioned firms find themselves funneling their profits into the sisyphean task of [unwinding the harms wrought by their own success](https://www.theverge.com/2019/2/25/18229714/cognizant-facebook-content-moderator-interviews-trauma-working-conditions-arizona).

**Any AI system empowered to publicly characterize a person _must_ allow that person to opt out**[^4]. On every author profile, there should be a button to petition for the deletion of the page, something more prominent than [a pointer to the legal team's email address](https://allenai.org/privacy-policy). If such a feature were easily implementable for Semantic Scholar, I would likely not have had issues with the platform in the first place. But I am raising the bar[^3] from the mere (unmet) promise to incorporate feedback to the provision of a guarantee that I not be conscripted for the correction of future problems.

As Google Scholar has long demonstrated, it's simpler to create profile pages only for users who want them, as they can then be called upon to contribute to curation. But the resulting sparse graph of author profiles would cut against the utility of Semantic Scholar. So we're left to gripe, and, along with some support staff, push rocks.

[^1]: The harm of the platform's generated profile pages _should_ be small, because in theory no important decisions are made based on metrics like citations or h-index. But beyond this, Semantic Scholar's APIs are broadly available, and might be used in any number of public or private tools. For instance, AI2 has made some efforts to facilitate the use of its data in [conference paper-matching systems](https://medium.com/ai2-blog/conference-peer-review-with-the-semantic-scholar-api-24ab9fce2324).

[^2]: AI2 have been aware of quality issues with the platform for years. Noah Smith, who works on other projects at AI2, [responding](https://twitter.com/nlpnoah/status/1194836101241831424) to another dissatisfied user four years ago:

    > I'm not sure where you think this responsibility for "quality control" comes from.  Any system this large will involve automation.  Anyone who understands automation understands there will be mistakes and improving quality is a continuous process.  Don't like it?  Don't use it.

    In a recent email, Noah clarified that it was specifically the expectation of manually checking all results that he felt was unrealistic. He further highlighted the platform's "[transparency] about the underlying data" and responsive moderation teams as mitigating factors.

[^3]: [dblp](https://dblp.org/) disambiguated my profile in 2019 within a day of my asking. There haven't been any mistakes since, perhaps because they defer to standard [ORCID](https://orcid.org/) identifiers wherever possible.

[^4]: See the White House's ["Blueprint for an AI Bill of Rights"](https://web.archive.org/web/20250118015329/https://www.whitehouse.gov/wp-content/uploads/2022/10/Blueprint-for-an-AI-Bill-of-Rights.pdf) for a more expansive expression of the same view, or the [CCPA](https://oag.ca.gov/privacy/ccpa) for a state's implementation. 