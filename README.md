# nickwalker.us [![Build Status](https://travis-ci.org/nickswalker/nickwalker.us.svg?branch=master)](https://travis-ci.org/nickswalker/nickwalker.us)

My portfolio website. Built with [Jekyll](https://jekyllrb.com), based off of [Minima](https://github.com/jekyll/minima).

* Blog posts with syntax highlighted code and rendered LaTex
* Custom project pages with tailored presentation
* YML based résumé/CV

## Development

Make sure you have Ruby `>=2.3` and [Bundler](http://bundler.io/) installed. Clone down the repo and run

    bundle install --path vendor/bundle

to install gem dependencies. Then

    bundle exec jekyll serve

to begin testing the site locally. Add `--drafts` and/or `--unpublished` to see WIP projects and posts.

To run tests

    bundle exec htmlproofer ./_site --only-4xx --check-favicon --check-html --assume-extension --alt-ignore '/.*/'

## Authoring

### Post

Types:

* Link: a linkpost, in the vein of Daring Fireball
* Blog: standalone post

Categories:

* News: display the headline on the homepage