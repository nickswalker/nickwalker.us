---
layout: default
permalink: /
---

<div class="container">
<div class="home">

  <section class="bio overflow-auto">
  <img class="avatar"
       src="{{site.gravatar_url}}?s=360"
       srcset="{{site.gravatar_url}}?s=720 2x"
  alt="Headshot of man wearing glasses and smiling"/>


<p>I'm a Ph.D. candidate at the University of Washington in Seattle. I work on human-robot interaction with the 
    <a href="https://hcrlab.cs.washington.edu">Human-Centered Robotics Lab</a>. Most of my research deals with human-robot communication, whether it's through <a href="{% details_link walker2024explicit %}">visual interfaces to help teleoperators</a> or
    <a href="{% details_link walker2021attributions %}">expressive motion</a> or <a href="{% details_link wang2024doing %}">natural language</a> for users. Previously, I worked on service robots with the 
    <a href="http://www.cs.utexas.edu/~larg/bwi_web/" data-goatcounter-click="ext-bwi">Building Wide Intelligence</a> project at UT Austin. Otherwise, I'm a 
    <a href="https://flickr.com/photos/nickwalker-us" data-goatcounter-click="ext-flickr.com-bio">photographer</a> and 
    <a href="https://www.strava.com/athletes/35387878" data-goatcounter-click="ext-strava.com">runner</a>.</p>

<p class="mt-4"><i>I am graduating in Spring 2025. <a href="/info">Contact me</a> if you have a role in robotics or user research.</i></p>
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