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
    <li class="d-inline"><a href="#" class="btn btn-outline-primary lh-sm">research</a></li>
    <li class="d-inline"><a href="#" class="btn btn-outline-primary lh-sm">running</a></li>
    <li class="d-inline"><a href="#" class="btn btn-outline-primary lh-sm">fun</a></li>
    <li class="d-inline"><a href="#" class="btn btn-outline-primary lh-sm">ios</a></li>
    <li class="d-inline"><a href="#" class="btn btn-outline-primary lh-sm">web</a></li>
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

    filter.addEventListener('click', function(e) {
        const target = e.target;
        if (target.tagName === 'A') {
            target.classList.toggle('btn-outline-primary');
            target.classList.toggle('btn-primary');
            for (let i = 0; i < filterButtons.length; i++) {
                if (filterButtons[i] !== target) {
                    filterButtons[i].classList.remove('btn-primary');
                    filterButtons[i].classList.add('btn-outline-primary');
                }
            }
            const isActive = target.classList.contains('btn-primary');
            if (!isActive) {
                filterButtons[0].dispatchEvent(new Event('click'));
            }

            
            const category = target.textContent.toLowerCase();
            projects.forEach(project => {
                if (category === 'all') {
                    project.style.display = '';
                } else {
                    const projectCategories = project.dataset.categories.split(' ');
                    if (projectCategories.includes(category)) {
                        project.style.display = '';
                    } else {
                        project.style.display = 'none';
                    }
                }
            });
        }
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