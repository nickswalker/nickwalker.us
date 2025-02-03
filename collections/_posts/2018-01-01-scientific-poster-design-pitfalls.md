---
layout: post
title:  "Scientific Poster Design Pitfalls"
date:   2018-01-01 10:48:02 -0700
categories: ["posters", "opinion", "communication", "design"]
published: true
type: blog
---

Most of the posters that I've observed are designed in haste, and contain problems that either simply make them _look bad_ or worse, illegible.  Fixing a few of them can help you elevate your poster-design practice. Here are my top four and their fixes.

## 4. Heavy Ink Coverage

Large areas of dark color don't print well. This is a byproduct of the way things get rasterized for the [CMYK process](https://en.wikipedia.org/wiki/CMYK_color_model) (a rich red might actually take more ink than black). The practical implication is that the poster will take longer to print and longer to dry, and will be vulnerable to muddiness that comes from oversaturating the paper.

Most templates will start you in the right direction, but you should be weary of swapping in dark colors or using figures with dark palettes.


## 3. Recycling Graphs from the Paper

Graphs that are appropriately scaled for a paper are not appropriately scaled for a poster. The degree to which this is true depends on the distance from which you expect people to view your poster. If you expect that you'll be talking to one person at a time, and that person will be 2 feet away from your poster, you can use graphs with no adjustment. This isn't a reasonable thing to expect in most conference settings though. It's more prudent to be prepared for at least two or three people standing as far as 5 feet away. If there are important figures for your pitch, make the salient parts legible at this distance. That doesn't necessarily mean directly blowing them up (you probably don't have space for that anyways). It might mean increasing the font-size of labels or extracting a subset of the information and presenting it more compactly but in a larger format.

Of the things in this list, this probably has the largest direct impact on the quality of the poster. If only one person can read your poster at a time because they need to stand directly in front of it, then _only one person will read your poster at a time_. Why limit your audience if you don't have to?


## 2. Misusing Branding

Universities and companies have brand guidelines (sometimes called identity guidelines) which lay out the proper use of logos and colors. Following them isn't just a service to your institution, they also help enforce good taste, suggesting coherent sets of typefaces and color schemes. Unless you know that you can make better choices, **just user your institution's branding guidelines**. 

### Using the Wrong Logo

Universities tend to have multifaceted brands meant to address athletics, academics and administrative needs. You can probably sense that it's inappropriate to use the athletics logo on a poster, but it's just as incongruous to use the university's seal. A poster is an informal product of an independent researcher and rarely carries the imprimatur of the university. Putting a seal on your poster is the design equivalent of coming to the session in a tuxedo. It's also a bit like putting a false stamp of approval on your poster. Every instance I've seen has been benign, but _it should make you uncomfortable_.

Prefer departmental or organizational-unit branding as it more accurately communicates who you are representing.

Of course, different institutions will have different standards, and this is why you should seek out the guidelines

### Putting Logos on the Wrong Background

Most identities make affordances for two common situations: logo on white background and logo on black background. If you don't have a copy of the logo with a transparent background, try to the image such that the background color matches.

### Using Low-resolution Logos

There should be no reason to see pixels when printing a logo. Whoever stewards the branding almost certainly has a stash of high resolution or resolution-independent logo assets. Often these come as part of the branding guidelines. If they don't, ask the branding office for them.


## 1. Using {La}TeX

Most LaTeX users know how to set text and equations. This is all you need for setting a paper because the publishing house has done the hard work of defining the macros that will actually control the layout. They can manage this because papers are all approximately the same number of pages and those pages are always letter-sized. Posters are different. A venue might put an upper bound on the dimensions of a poster, but that's about it. The design of the poster is largely up to the needs of the material being presented and maybe the specs of the printer. 

Because of the highly variable constraints, you'll almost always have to modify whatever template you start with to suit the case at hand. Maybe you'll need to make an important figure to span two columns, or you'll have to shrink a column to fit in your area limit. If the template comes from one of the many LaTeX [packages](https://ctan.org/pkg/beamerposter) [for](https://www.brian-amberg.de/uni/poster/) [poster](https://ctan.org/pkg/tikzposter) [design](https://ctan.org/pkg/a0poster), you will need a good grasp of TeX to bend it to your will. There exist people with the skill to do this, but if you are not one of those five people, _this is not a productive way to spend your time_. It's possible to hack a solution to most things, but that solution is going to be poor. You'll be tempted to let some things slide, and you'll end up stuck with a bunch of the other problems I've listed here.

Services like [Overleaf](https://overleaf.com ) may centralize enough good examples that it'll be easy to make a good poster in LaTeX. Until then, **prefer tools like PowerPoint or [Google Drawings](https://docs.google.com/drawings/
)** where the barrier to changing things is lower. You'll have to render math separately, but it's straightforward to insert equations as images.


<hr/>

Honorable mention goes to common typographical shortfalls, including using lifeless typefaces for headers, not sticking with a consistent grid, and bullets that aren't hanging. These have much less of an impact on the qualities of the poster that matter, but if you're interested, skimming _[The Elements of Typographic Style](https://en.wikipedia.org/wiki/The_Elements_of_Typographic_Style)_ will make it so that you can never un-see them.

