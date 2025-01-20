---
title:  "Marblizer"
date:   2016-12-17 10:48:02 -0700
categories: ["fun","web"]
description: |
   An interactive paper marbling simulation that lets you create marbled images in the browser. Paper marbling is a traditional art practice in which inks are floated on a liquid surface then transferred to a sheet of paper. This simulation works by evaluating the effect of each tool on a discretized representation of the boundary of each ink drop. This limits the operations compared to a fluid-dynamics based simulation, but its simple to implement and the boundary of drops remain crisp for longer.

link: "https://marblizer.nickwalker.us/"
code_url: "https://github.com/nickswalker/marblizer"
report: "report.pdf"
slides: "slides.pdf"

images:
    - "example1.png"
    - "example2.png"
    - "example3.png"

featured_image_rel: "banner.jpg"
has_article: true

---

[Paper marbling](https://en.wikipedia.org/wiki/Paper_marbling) is a traditional art practice in which inks are floated on a liquid surface then transferred to a sheet of paper. The resulting designs can resemble marble, but outputs range from intricate spiraling patterns to spattered, space-like images.

[Marblizer](https://marblizer.nickwalker.us/) is an interactive paper marbling simulation that lets you create marbled images in the browser. It's built in Typescript and uses the Canvas API. If you aren't much of a doodler, it includes an in-browser IDE so you can create scripted compositions in Javascript. Its principle operations are based on [the work](http://www.cad.zju.edu.cn/home/jin/cga2012/cga2012.htm) of Lu et. al, and you can see some exposition of the methods in the report and slides.

Let me know if you make anything cool with it! I'd love to share your images/scripts.

## See also

- [Jingyi Chen's local tool mode extension](https://jingyicc.github.io/projects/watermarbling/)
