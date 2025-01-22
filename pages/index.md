---
layout: default
permalink: /
---

<div class="container home">

  <section class="overflow-auto">
<a href="{% link pages/about.md %}">  
<img class="avatar float-start"
       src="{{site.gravatar_url}}?s=360"
       srcset="{{site.gravatar_url}}?s=720 2x"
  alt="Headshot of man wearing glasses and smiling"/>
</a>
  <p markdown="1">
I'm a Ph.D. candidate at the University of Washington in Seattle. I work on human-robot interaction with the [Human-Centered Robotics Lab](https://hcrlab.cs.washington.edu). Most of my research deals with human-robot communication, whether it's through [visual interfaces to help teleoperators]({% details_link walker2024explicit %}) or [expressive motion]({% details_link walker2021attributions %}) or [natural language]({% details_link wang2024doing %}) for users.  Previously, I worked on service robots with the [Building Wide Intelligence](http://www.cs.utexas.edu/~larg/bwi_web/){: data-goatcounter-click="ext-bwi"} project at UT Austin. Otherwise, I'm a [photographer](https://flickr.com/photos/nickwalker-us){: data-goatcounter-click="ext-flickr.com-bio"} and [runner](https://www.strava.com/athletes/35387878){: data-goatcounter-click="ext-strava.com"}.
</p>

<div class="mt-4" markdown="1">

_I am graduating in Spring 2025. [Contact me]({% link pages/about.md %}#contact) if you have a role in robotics or user research._

</div>


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
          <a class="post-link" href="{{ post.url }}">{{ post.title | escape | markdownify | remove: '<p>' | remove: '</p>' }}</a>
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
            {% for post in site.categories.blog limit:3 %}<a href="{{ post.url }}">{{ post.title | escape | markdownify | remove: '<p>' | remove: '</p>'  }}</a>, {%
            endfor %} and <a href="{{ site.baseurl }}/blog/archive/"> more</a>.</p>
    </section>

    <section id="notes">
        <h1 class="page-heading">Notes</h1>
        <p class="blog-line d-flex flex-wrap gap-2">
            {% for page in site.pages %}{% assign categories_string = page.categories | join: ' ' %}
{% if categories_string contains 'note' %}<a href="{{ page.url }}">{{ page.title | escape | markdownify | remove: '<p>' | remove: '</p>'  }}</a> <span>&middot;</span>{% endif %}{%
            endfor %}</p>
    </section>
</div>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Homepage",
  "mainEntity": {
    "@type": "Person",
    "@id": "{{site.url}}{% link pages/about.md %}",
    "name": "Nick Walker",
"sameAs": [
"https://scholar.google.com/citations?user={{ site.google_scholar_id }}",
"https://dblp.org/pid/{{ site.dblp_id }}"
]
},

"isPartOf": {
"@type": "WebSite",
"name": "Nick Walker",
"url": "{{site.url}}"
}
}
</script>