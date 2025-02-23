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

<ul class="list-unstyled filter">
    <li class="d-inline"><a href="#" class="btn btn-primary lh-sm">all</a></li>
    <li class="d-inline"><a href="#" class="btn btn-outline-primary filter-option lh-sm">research</a></li>
    <li class="d-inline"><a href="#" class="btn btn-outline-primary filter-option lh-sm">running</a></li>
    <li class="d-inline"><a href="#" class="btn btn-outline-primary filter-option lh-sm">fun</a></li>
    <li class="d-inline"><a href="#" class="btn btn-outline-primary filter-option lh-sm">ios</a></li>
    <li class="d-inline"><a href="#" class="btn btn-outline-primary filter-option lh-sm">web</a></li>
</ul>

<ul class="list-unstyled">
    {% for project in projects %}
    <li class="mb-4" id="{{ project.slug }}">
    {% include project_block.html project=project %}
    </li>
    {% endfor %}
</ul>

<script>
function filterProjects() {
  const filter = document.querySelector('.filter');
  const filterButtons = filter.querySelectorAll('a');
  const projects = document.querySelectorAll('.project-block');

  filter.addEventListener('click', function (e) {
    const target = e.target;
    if (target.tagName !== 'A') return;
    e.preventDefault();

    // Activate clicked button, deactivate others.
    filterButtons.forEach(btn => {
      if (btn === target) {
        btn.classList.remove('btn-outline-primary');
        btn.classList.add('btn-primary');
      } else {
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-outline-primary');
      }
    });

    // If the button was deactivated, reselect "All".
    if (!target.classList.contains('btn-primary')) {
      filterButtons[0].dispatchEvent(new Event('click', { bubbles: true }));
      return;
    }

    // Use data attribute if available, fallback to text content.
    const category = target.dataset.category || target.textContent.toLowerCase();

    projects.forEach(project => {
      if (category === 'all') {
        project.style.display = '';
      } else {
        const projectCategories = project.dataset.categories.split(' ');
        project.style.display = projectCategories.includes(category) ? '' : 'none';
      }
    });
  });
}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        filterProjects();
    });
} else {
    filterProjects();
}
</script>