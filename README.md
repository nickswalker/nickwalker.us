# nickwalker.us [![Build and Deploy](https://github.com/nickswalker/nickwalker.us/workflows/Build%20and%20Deploy/badge.svg)](https://github.com/nickswalker/nickwalker.us/actions?query=workflow%3A%22Build+and+Deploy%22)

My portfolio website. Built with [Jekyll](https://jekyllrb.com), based off of [Minima](https://github.com/jekyll/minima).

* Blog posts with syntax highlighted code and rendered LaTex
* Custom project pages with tailored presentation
* YML based résumé/CV

## Development

Make sure you have Ruby `>=2.6` and [Bundler](http://bundler.io/) installed. You can manage Ruby installations with rbenv. Clone down the repo and run

    bundle install 

to install gem dependencies. Then

    bundle exec jekyll serve

to begin testing the site locally. Add `--drafts` and/or `--unpublished` to see WIP projects and posts.

To run tests

    bundle exec htmlproofer ./_site --only-4xx --check-favicon --check-html --assume-extension --alt-ignore '/.*/'

## Authoring

### Post

Types: string

* Link: a linkpost, in the vein of Daring Fireball
* Blog: standalone post

Categories: space separated list

* News: display the headline on the homepage
* Blog: will display in the blog line on homepage
* Research: own research
* Running:
