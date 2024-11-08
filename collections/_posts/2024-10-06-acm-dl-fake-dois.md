---
title: "The ACM Digital Library Has a Fake DOI Problem"
date: 2024-10-06 12:00 -0600
type: blog
featured: false
categories: blog research
published: true
---

The ACM Digital Library sometimes presents fake DOIs, and it's spreading broken links across the web.

DOIs are unique, permanent identifiers for research artifacts. Publishers assign a DOI to a paper, then `https://doi.org/` resolves it to the paper's landing page in perpetuity. When publishers fold, they transfer stewardship to another entity and the link lives on. They're academic permalinks, so you can find them in citations, on CVs, and in the metadata of papers themselves.

I noticed ACM DL's odd DOIs while looking at the HRI 2022 proceedings, where every paper's page has a URL that looks like `https://dl.acm.org/doi/10.5555/3523760.3524000`. The DOI implied by this URL, `10.5555/3523760.3524000`, is not real and <a href="https://doi.org/10.5555/3523760.3524000" data-proofer-ignore>does not resolve</a>. Turns out, ACM uses the `10.5555` prefix anywhere that it cross-lists content from another publisher, as in this case with IEEE. Each of these documents has a real DOI, issued by IEEE and resolvable to a page in IEEEXplore, but ACM won't tell you what it is. This paper's is [10.1109/HRI53351.2022.9889569](https://doi.org/10.1109/HRI53351.2022.9889569).

Exporting the citation for these cross-listed papers omits the DOI field, but the BibTeX key includes the fake DOI. This makes it easy to mistakenly use the fake DOI as the `doi=` field, especially since BibTeX keys are usually formatted as `authorYYYYtitle`.

{% include article_multiimage.html images="/assets/images/posts/acm-doi-real.png /assets/images/posts/acm-doi-fake.png" caption="Both entries appear to be keyed with DOIs, but the DOI for the paper published through IEEE Press is not real." %}

Nothing here is technically incorrect, but it's misleading. You can find [dozens of these fake DOIs being treated as real in the wild](https://www.google.com/search?q="doi.org%2F10.5555"). I found them on [lab](https://healthrobotics.ucsd.edu/papers/HRI-kubota.html) [web](https://deepblue.lib.umich.edu/handle/2027.42/171268) [pages](https://hrilab.tufts.edu/publications/yazdanietal17aamas/), in [metadata](https://arxiv.org/abs/2201.02392), and even [published papers](https://graphics.cs.wisc.edu/Papers/2023/PGM23/pgm.pdf).

It seems likely that this is happening because the Digital Library uses DOIs as natural keys for its entries. This is another good example of [why you shouldn't use natural keys](https://blog.ploeh.dk/2024/06/03/youll-regret-using-natural-keys/), even supposedly unique and identifying ones like DOIs. If placeholder values are used (tsk-tsk), they can mislead users into treating them as genuine identifiers. Users wouldn't make the same mistake if every page were keyed with a [UUID](https://en.wikipedia.org/wiki/Universally_unique_identifier).