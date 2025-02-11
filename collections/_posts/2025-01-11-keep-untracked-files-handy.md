---
title: Keep Untracked Files Handy with a Global .gitignore Pattern
type: blog
categories: ["tip"]
date: 2025-01-11 20:58 -0800
---

I often find myself in a situation where I have a file that I want to keep around, but don't want to commit to the repository. Things like notes (`todo.txt`) or examples (`bug_repro.py`) or maybe an uncompressed version of an image (`banner_xxl.jpg`). They could live somewhere outside the source tree, but I like to keep them close to the code they relate to so I don't forget about them.

Instead of cluttering every repo's `.gitignore` with one-off rules, I adopted the prefix `_#_` for any file or directory I want Git to ignore. This way I can just add the pattern to the global `.gitignore` rules (at `$HOME/.config/git/ignore` [by default](https://git-scm.com/docs/gitignore#_pattern_format) on macOS):

```gitignore
_#_*
```

Simple, but it keeps my workflow clean and my untracked files where I can find them.