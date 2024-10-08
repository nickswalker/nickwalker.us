---
layout: default
bio: I'm a Ph.D. candidate at the University of Washington in Seattle. I work on human-robot interaction with the [Human-Centered Robotics Lab](https://hcrlab.cs.washington.edu). Most of my research deals with human-robot communication, either [implicit](https://nickwalker.us/publications/walker2021attributions) or [explicit](https://nickwalker.us/publications/jiang2019icaps). Previously, I was a student at UT Austin, where I worked on service robots with the [Building Wide Intelligence](http://www.cs.utexas.edu/~larg/bwi_web/) project. Otherwise, I'm a [photographer](https://flickr.com/photos/nickwalker-us) and [runner](https://www.strava.com/athletes/35387878).
permalink: /
---

<div class="container">
<div class="home">

  <section class="bio overflow-auto">
  <img class="avatar"
       src="{{site.gravatar_url}}?s=360"
       srcset="{{site.gravatar_url}}?s=720 2x"
  alt="Headshot of man wearing glasses and smiling"/>

    {{page.bio | markdownify}}
  </section>

{% assign post_count = site.posts | size %}
{% if post_count > 0 %}
  <section id="posts">
    <a class="rss-note" href="{{ '/feed.xml' | relative_url }}">RSS</a>
    <h1 class="page-heading">News</h1>
    <ul class="post-list">
        {% for post in site.categories.news limit:4 %}
      <li>
        <span class="post-meta">{{ post.date | date: "%b %-d, %Y" }}</span>
        <h2>
          <a class="post-link" href="{{ post.url }}">{{ post.title | escape }}</a>
        </h2>
      </li>
      {% endfor %}
    </ul>

     <a class="btn btn-outline-primary" href="{% link pages/archive.md %}">More</a>


  </section>
    {% endif %}

    {% assign featured_projects = site.projects | where:"featured", true %}
{% comment %}
{% if featured_projects.size > 0 %}
  <section id="projects">
    <h1 class="page-heading">Projects</h1>
      <ul class="project-block-list">
      {% for project in featured_projects %}
        {% include project_block.html project=project %}
      {% endfor %}
    </ul>
      {% if site.projects.size > featured_projects.size %}

      <div class="quick-link"><a href="{% link pages/projects.md %}">More</a></div>

      {% endif %}
  </section>
    {% endif %}
  {% endcomment %}

    <section id="blog">
        <h1 class="page-heading">Blog</h1>
        <p class="blog-line">
            {% for post in site.categories.blog limit:3 %}<a href="{{ post.url }}">{{ post.title | escape }}</a>, {%
            endfor %} and <a href="{{ site.baseurl }}/blog/archive/"> more</a>.</p>
    </section>

</div>
</div>