---
layout: page
title: Projects
permalink: projects/
---


{% assign ongoing_projects = site.projects | where_exp: "item", "item.end_date == empty" %}
{% assign ongoing_sorted = ongoing_projects | sort: "date" | reverse %}

{% assign completed_projects = site.projects | where_exp: "item", "item.end_date != empty and item.date" %}
{% assign completed_sorted = completed_projects | sort: "date" | reverse %}


{% assign projects = ongoing_sorted | concat: completed_sorted %}

<ul class="list-unstyled">
    {% for project in projects %}
    <li class="mb-4" id="{{ project.slug }}">
    {% include project_block.html project=project %}
    </li>
    {% endfor %}
</ul>
