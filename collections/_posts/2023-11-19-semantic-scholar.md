---
title: "Delete My Semantic Scholar Author Profile"
date: 2023-11-19 12:00 -0600
type: blog
categories: ["opinion"]
published: true
---

In my five years of sporadic checking, Semantic Scholar has never accurately reflected my publication record. 

Early on, it included articles from other Nick Walkers. This kind of thing happens. Like Google Scholar and other large scale indices, Semantic Scholar collects and munges data of various quality, and essentially [has to guess](https://arxiv.org/pdf/2103.07534.pdf) how many Nick Walkers there are and how to assign papers to them. While _you_ can tell that [a paper]({% details_link jiang2019icaps %}) about service robots is unlikely to come from a [synthetic aperture radar expert](https://ieeexplore.ieee.org/author/38181749600), or a [British professor of chemistry](https://www.ncl.ac.uk/nes/people/profile/nickwalker.html), the technology of 2019 was not up to the task. After failing to correct the issue myself with their limited tools, I eventually [emailed support](https://x.com/nickwalker_us/status/1130618707267342336), and they fixed enough of the problem for me to stop trying.

The latest issue is more pernicious. In recent years I've had two profiles, <a href="https://www.semanticscholar.org/author/Nick-Walker/145314605" data-proofer-ignore>a "verified" one</a> which includes four publications, and <a href="https://www.semanticscholar.org/author/Nick-Walker/8257289" data-proofer-ignore>another</a> which includes the rest. This abbreviated profile is attached to the papers that show up first in most search results for my name. It's likely that its verification is somehow a result of my flailing to fix the previous issues.

{% include article_multiimage.html images="/assets/images/posts/semantic-scholar-profile-1.png /assets/images/posts/semantic-scholar-profile-2.png" caption="My two profiles on Semantic Scholar on November 7th, 2023." %}


My emails to support over the past couple months haven't led to the issue being fixed, and there is no other means of recourse. What happens when you send the email? I'm not sure, but based on my observation, support staff approve the request, then file a polite suggestion to some machine learning pipeline which proceeds to do jack all with it.

**Update December 20th, 2023**: The two profiles have been merged, likely as a result of internal escalation after emailing this post to the team. There remains no way to opt out of having a profile.

**Update February 10th, 2025**: At my request, Semantic Scholar deleted my profiles. Now there's [a new stub profile](https://www.semanticscholar.org/author/Nick-Walker/2283347475) ([image](/assets/images/posts/semantic-scholar-2025.png) for posterity), again with the latest crop of papers. Seven years later, still mopping AI slop.


-------------

This harm[^1] is small [but familiar](https://en.wikipedia.org/wiki/Externality). A technology enables something new, something which would've traditionally required unimaginable human effort. The technology is pushed to its limit so it can create value. It's only after this point---due to a lack of earlier critical evaluation[^2]---that a litany of issues arises, issues which can only reliably be resolved with...an unimaginable amount of human effort. As Google Scholar has demonstrated, it's simpler to create profile pages only for users who want them, as they can then be asked to help fix mistakes. But the resulting sparse graph of author profiles would make Semantic Scholar a much less valuable tool.

**Any AI system empowered to publicly characterize a person _must_ allow that person to opt out**[^4]. On every author profile, there should be a button to request the deletion of the page, something more prominent than [a pointer to the legal team's email address](https://allenai.org/privacy-policy). I think everyone agrees that the ability to incorporate feedback is a basic[^3] and necessary feature for a product like Semantic Scholar. But the bar should be the ability to guarantee you won't have to give feedback again.


[^1]: The harm of generated profile pages _should_ be small, because no important decisions are made based on metrics like citations or h-index (right?). But beyond this, Semantic Scholar's APIs are broadly available, and might be used in any number of public or private tools. For instance, AI2 has made efforts to facilitate the use of its data in [conference paper-matching systems](https://medium.com/ai2-blog/conference-peer-review-with-the-semantic-scholar-api-24ab9fce2324).

[^2]: AI2 have been aware of quality issues with the platform for years. Noah Smith, who works on other projects at AI2, [responding](https://twitter.com/nlpnoah/status/1194836101241831424) to another dissatisfied user four years ago:

    > I'm not sure where you think this responsibility for "quality control" comes from.  Any system this large will involve automation.  Anyone who understands automation understands there will be mistakes and improving quality is a continuous process.  Don't like it?  Don't use it.

    In a recent email, Noah clarified that it was specifically the expectation of manually checking all results that he felt was unrealistic. He further highlighted the platform's "[transparency] about the underlying data" and responsive moderation teams as mitigating factors. I am not able to identify from where in the underlying data my duplicate identies are coming from.

[^3]: [dblp](https://dblp.org/) disambiguated my profile in 2019 within a day of my asking. There haven't been any mistakes since, perhaps because they defer to standard [ORCID](https://orcid.org/) identifiers wherever possible.

[^4]: See the White House's ["Blueprint for an AI Bill of Rights"](https://web.archive.org/web/20250118015329/https://www.whitehouse.gov/wp-content/uploads/2022/10/Blueprint-for-an-AI-Bill-of-Rights.pdf) for a more expansive expression of the same view, or the [CCPA](https://oag.ca.gov/privacy/ccpa) for a state's implementation. 