---
layout: post
title:  "Scientific Poster Design Sins"
date:   2017-12-01 10:48:02 -0700
categories: posters opinion communication
published: true
type: blog
---

I've seen a large enough number of posters now to see that many people fumble a small set of things, resulting in posters that either _looks bad_ or are simply illegible. Here are my top four.

## 1. Using {La}TeX

Atleast, when you don't know LaTeX well enough to pull it off.

Many people know how to set text and equations in LaTeX, but little else. This is fine for setting a paper because the publishing house has done the hard work of defining the macros that will actually control the layout. They can manage this because papers are all about the same number of pages, and those pages are always letter-sized. A venue might put an upper bound on the dimensions of a poster, but that's about it. The design of the poster is largely up to the needs of the material being presented, and maybe the printing capabilities available.

Because of the highly variable constraints, you'll almost always have to modify whatever template you start with to suit the case at hand. Maybe you'll need to make an important figure span two columns, or you'll have to shrink a column to fit in your area limit. If the template comes from one of the many LaTeX [packages](https://ctan.org/pkg/beamerposter) [for](http://www.brian-amberg.de/uni/poster/) [poster](https://ctan.org/pkg/tikzposter) [design](https://ctan.org/pkg/a0poster), you will need a good grasp of TeX to bend it to your will. There exist people with the skill to do this, but I have not encountered any of them. You'll hack a solution, and that solution will be poor. Moreover, the inflexibility will railroad you into many of the other faux pas I list here.

By removing the burden of having to maintain a working LaTeX toolchain and making it easier to share documents, services like [Overleaf](https://overleaf.com ) may create the critical mass of resources and working examples that will reduce the difficulty of making a good poster with LaTeX. Until then, prefer tools like PowerPoint or [Google Drawings](https://docs.google.com/drawings/
) where the barrier to changing anything is lower. You'll have to render important equations separately, but it is not difficult to insert them into these tools afterwards.

## 2. Misusing Your Institution's Branding

Your institution, whether it's a university or a company, has brand guidelines (sometimes called identity guidelines) which lay out the proper use of its logos and colors. This kind of pedantry isn't just a service to your institution. Branding guidelines enforce good taste, suggesting coherent sets of typefaces and color schemes. Unless you have reason to believe you can make better choices, using the guidelines will keep your overall design on track. 

### Using the Wrong Logo

Universities tend to have multifaceted brands meant to address athletics, academics and administrative needs. You can probably sense that it's inappropriate to use the athletics logo on a poster, but it's just as incongruous to use the university's seal. A poster is an informal product of an independent institutional affiliate and rarely carries the imprimatur of the university. Although putting a seal on your poster is perhaps the design equivalent of coming to the session overdressed, it shares air with placing a false signature on a document.

Prefer departmental or organizational-unit branding as it more accurately communicates who you are representing.

Of course, different institutions will have varying standards, and this is why you should seek out the guidelines

### Putting Logos on the Wrong Background

Most identities make affordances for two common situations: logo on white background and logo on black background. Very few make any affordance for whatever shade of blue your template has the background set to. 

Putting the logo on a white rectangle only makes the visual racket more pronounced.

### Using Low-resolution Logos

This is a minor nuisance, but an unnecessary one. Whoever stewards the branding almost certainly has a stash of high resolution or resolution-independent logo assets. Often these come as part of the branding guidelines. If they don't, ask the branding office for them.

## 3. Recycling Graphs from the Paper

Graphs that are appropriately scaled for a paper are not appropriately scaled for a poster. The degree to which this is true depends on the distance from which you expect people to view your poster. If you expect that you'll be talking to one person at a time, and that person will be 2 feet away from your poster, then you can slap your graphs up with no adjustment. But it's more prudent to be prepared for at least two or three people standing as far as 5 feet away. If there are important figures for your pitch, make the salient parts legible at this distance. That doesn't necessarily mean blindly blowing them up (you probably don't have space for that anyways). It might mean increasing the font-size of labels or extracting a subset of the information and presenting it more compactly but in a larger format.

Of the things in this list, this probably has the largest impact on the quality of the poster. If only one person can read your poster at a time because they need to stand directly in front of it, then _only one person will read your poster at a time_. Don't limit your audience if you don't have to.

## 4. Heavy Ink Coverage

Large areas of dark color don't print well. This is a byproduct of the way things get rastered for the [CMYK process](https://en.wikipedia.org/wiki/CMYK_color_model). The practical implication is that, if you have large areas of dark color on your poster, it'll take longer to print and longer to dry, and you become vulnerable to the muddiness and artifacts associated with oversaturating the paper.

Most templates are on the correct side of this issue but this seems to be a common problem regardless.

<hr/>

I have more gripes, but many of them are artifacts of the minimal sophistication of the average researcher's taste in type and graphic matters. Nothing that can't be remedied by skimming _[The Elements of Typographic Style](https://en.wikipedia.org/wiki/The_Elements_of_Typographic_Style)_.

