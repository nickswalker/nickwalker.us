---
layout: post
title:  "Scientific Poster Design Pitfalls"
date:   2017-12-01 10:48:02 -0700
categories: posters opinion communication
published: true
type: blog
---

In most of the posters that I've observed, the authors have fumbled one of a small set of things, resulting in posters that either _look bad_ or are simply illegible. None of these are particularly damning, but fixing a few of them can help you elevate your poster-design practice. Here are my top four and their fixes.

## 4. Heavy Ink Coverage

Large areas of dark color don't print well. This is a byproduct of the way things get rasterized for the [CMYK process](https://en.wikipedia.org/wiki/CMYK_color_model) (a rich red might actually take more ink than black). The practical implication is that the poster will take longer to print and longer to dry, and will be vulnerable to the muddiness and artifacts associated with oversaturating the paper.

Most templates will start you in the right direction, but you should remain weary of swapping in dark colors or using figures with dark palettes.


## 3. Recycling Graphs from the Paper

Graphs that are appropriately scaled for a paper are not appropriately scaled for a poster. The degree to which this is true depends on the distance from which you expect people to view your poster. If you expect that you'll be talking to one person at a time, and that person will be 2 feet away from your poster, you can use graphs with no adjustment. This isn't a reasonable thing to expect in most conference settings though. It's more prudent to be prepared for at least two or three people standing as far as 5 feet away. If there are important figures for your pitch, make the salient parts legible at this distance. That doesn't necessarily mean blindly blowing them up (you probably don't have space for that anyways). It might mean increasing the font-size of labels or extracting a subset of the information and presenting it more compactly but in a larger format.

Of the things in this list, this probably has the largest direct impact on the quality of the poster. If only one person can read your poster at a time because they need to stand directly in front of it, then _only one person will read your poster at a time_. Don't limit your audience if you don't have to.


## 2. Misusing Branding

Most any institution, whether it's a university or a company, has brand guidelines (sometimes called identity guidelines) which lay out the proper use of its logos and colors. This kind of pedantry isn't just a service to your institution. Branding guidelines enforce good taste, suggesting coherent sets of typefaces and color schemes. Unless you know that you can make better choices, **hew to your institution's branding guidelines**. 

### Using the Wrong Logo

Universities tend to have multifaceted brands meant to address athletics, academics and administrative needs. You can probably sense that it's inappropriate to use the athletics logo on a poster, but it's just as incongruous to use the university's seal. A poster is an informal product of an independent institutional affiliate and rarely carries the imprimatur of the university. Although putting a seal on your poster is perhaps the design equivalent of coming to the session overdressed, it's also a bit like putting a false stamp of approval on your poster. Every instance I've seen has been benign, but _it should make you uncomfortable_.

Prefer departmental or organizational-unit branding as it more accurately communicates who you are representing.

Of course, different institutions will have varying standards, and this is why you should seek out the guidelines

### Putting Logos on the Wrong Background

Most identities make affordances for two common situations: logo on white background and logo on black background. Very few make any affordance for whatever shade of blue your template has the background set to. 

Putting the logo on a white rectangle only makes the visual racket more pronounced.

### Using Low-resolution Logos

This is a minor nuisance, but an unnecessary one. Whoever stewards the branding almost certainly has a stash of high resolution or resolution-independent logo assets. Often these come as part of the branding guidelines. If they don't, ask the branding office for them.


## 1. Using {La}TeX

Most LaTeX users know how to set text and equations. This is fine for setting a paper because the publishing house has done the hard work of defining the macros that will actually control the layout. They can manage this because papers are all about the same number of pages and those pages are always letter-sized. Posters are different. A venue might put an upper bound on the dimensions of a poster, but that's about it. The design of the poster is largely up to the needs of the material being presented and maybe the printing capabilities available. 

Because of the highly variable constraints, you'll almost always have to modify whatever template you start with to suit the case at hand. Maybe you'll need to make an important figure span two columns, or you'll have to shrink a column to fit in your area limit. If the template comes from one of the many LaTeX [packages](https://ctan.org/pkg/beamerposter) [for](https://www.brian-amberg.de/uni/poster/) [poster](https://ctan.org/pkg/tikzposter) [design](https://ctan.org/pkg/a0poster), you will need a good grasp of TeX to bend it to your will. There exist people with the skill to do this, but if you are not one of those five people, _this is not a productive way to spend your time_. It's possible to hack a solution to most things, but that solution is going to be poor. You'll be tempted to let some things slide, and you'll end up stuck with a bunch of the other problems I've listed here.

By removing the burden of having to maintain a working LaTeX toolchain and making it easier to share documents, services like [Overleaf](https://overleaf.com ) may centralize enough good examples that it'll be easy to make a good poster in LaTeX. Until then, **prefer tools like PowerPoint or [Google Drawings](https://docs.google.com/drawings/
)** where the barrier to changing things is lower. You'll have to render math separately, but it is not difficult to insert high-quality images of 


<hr/>

Honorable mention goes to the smattering of oh-so-common typographical shortfalls, including using lifeless typefaces for headers, not sticking with a consistent grid, and not using hanging bullets. These have much less of an impact on the qualities of the poster that matter, but if you're interested, skimming _[The Elements of Typographic Style](https://en.wikipedia.org/wiki/The_Elements_of_Typographic_Style)_ will help you avoid these.

