---
layout: page-restrict-width
title: Publications
permalink: publications/
redirect_from:
  - /bibliography/
custom_js:
  - /assets/js/bibCite.js
---

<ul class="list-unstyled filter">
    <li><a href="#" class="btn btn-primary lh-sm">all</a></li>
    <li><a href="#" class="btn btn-outline-primary filter-option lh-sm">conference</a></li>
    <li><a href="#" class="btn btn-outline-primary filter-option lh-sm">journal</a></li>
    <li><a href="#" class="btn btn-outline-primary filter-option lh-sm">workshop</a></li>
    <li><a href="#" class="btn btn-outline-primary filter-option lh-sm">periodical</a></li>
</ul>

## 2026

{% bibliography --query @*[year=2026 && wwwhidden!=true]%}

<!--
{% bibliography --query @*[year=2026 && wwwhidden=true]%}
-->

## 2025

{% bibliography --query @*[year=2025 && wwwhidden!=true]%}

<!--
{% bibliography --query @*[year=2025 && wwwhidden=true]%}
-->


## 2024
{% bibliography --query @*[year=2024 && wwwhidden!=true]%}

<!--
{% bibliography --query @*[year=2024 && wwwhidden=true]%}
-->


## 2023
{% bibliography --query @*[year=2023 && wwwhidden!=true]%}

<!--
{% bibliography --query @*[year=2023 && wwwhidden=true]%}
-->

## 2022
{% bibliography --query @*[year=2022 && wwwhidden!=true]%}

<!--
{% bibliography --query @*[year=2022 && wwwhidden=true]%}
-->

## 2021
{% bibliography --query @*[year=2021 && wwwhidden!=true]%}

<!--
{% bibliography --query @*[year=2021 && wwwhidden=true]%}
-->

## 2020
{% bibliography --query @*[year=2020 && wwwhidden!=true]%}

<!--
{% bibliography --query @*[year=2020 && wwwhidden=true]%}
-->

## 2019
{% bibliography --query @*[year=2019 && wwwhidden!=true]%}

<!--
{% bibliography --query @*[year=2019 && wwwhidden=true]%}
-->

## 2018
{% bibliography --query @*[year=2018 && wwwhidden!=true]%}

<!--
{% bibliography --query @*[year=2018 && wwwhidden=true]%}
-->

## 2017
{% bibliography --query @*[year=2017 && wwwhidden!=true]%}

<!--
{% bibliography --query @*[year=2017 && wwwhidden=true]%}
-->

<style>
.bibliography > li {
  transition: opacity 0.2s ease, display 0.2s allow-discrete;
}
.bibliography > li.pub-hidden {
  display: none;
  opacity: 0;
}
@starting-style {
  .bibliography > li:not(.pub-hidden) {
    opacity: 0;
  }
}

.pub-year-heading {
  transition: opacity 0.2s ease, display 0.2s allow-discrete;
}
.pub-year-heading.pub-hidden {
  display: none;
  opacity: 0;
}
@starting-style {
  .pub-year-heading:not(.pub-hidden) {
    opacity: 0;
  }
}
</style>

<script>
// Filter categories may map to more than one underlying wwwtype.
const PUBLICATION_FILTERS = {
  conference: ['conference'],
  journal: ['journal'],
  workshop: ['workshop', 'symposium'],
  periodical: ['periodical'],
};

function filterPublications() {
  const filter = document.querySelector('.filter');
  if (!filter) return;
  const filterButtons = filter.querySelectorAll('a');
  const entries = document.querySelectorAll('.bibliography .mb-4[data-wwwtype]');

  // Mark year headings adjacent to bibliography lists for CSS targeting.
  document.querySelectorAll('.bibliography').forEach(list => {
    const heading = list.previousElementSibling;
    if (heading && heading.tagName === 'H2') heading.classList.add('pub-year-heading');
  });

  filter.addEventListener('click', function (e) {
    const target = e.target;
    if (target.tagName !== 'A') return;
    e.preventDefault();

    // If clicking the already-active non-"all" filter, toggle back to "all".
    if (target.classList.contains('btn-primary') && target !== filterButtons[0]) {
      filterButtons[0].dispatchEvent(new Event('click', { bubbles: true }));
      return;
    }

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

    const category = target.dataset.category || target.textContent.toLowerCase();
    const allowed = PUBLICATION_FILTERS[category] || [category];

    // Show/hide each entry's list item.
    document.querySelectorAll('.bibliography > li').forEach(li => {
      const entry = li.querySelector('.mb-4[data-wwwtype]');
      const type = entry ? entry.dataset.wwwtype : null;
      const hide = category !== 'all' && !(type && allowed.includes(type));
      li.classList.toggle('pub-hidden', hide);
    });

    // Hide year headings whose list has no visible entries.
    // The ul itself stays visible so child transitions can play out.
    document.querySelectorAll('.bibliography').forEach(list => {
      const hasVisible = Array.from(list.children).some(li => !li.classList.contains('pub-hidden'));
      const heading = list.previousElementSibling;
      if (heading && heading.tagName === 'H2') {
        heading.classList.toggle('pub-hidden', !hasVisible);
      }
    });

    // Update the URL: remove parameter for "all", otherwise set it.
    const newUrl = new URL(window.location);
    if (category === 'all') {
      newUrl.searchParams.delete('filter');
    } else {
      newUrl.searchParams.set('filter', category);
    }
    history.replaceState(null, '', newUrl);
  });

  // Auto-select filter based on URL parameter.
  const params = new URLSearchParams(window.location.search);
  const filterParam = params.get('filter');
  if (filterParam) {
    let found = false;
    filterButtons.forEach(btn => {
      const btnCategory = btn.dataset.category || btn.textContent.toLowerCase();
      if (btnCategory.toLowerCase() === filterParam.toLowerCase()) {
        btn.dispatchEvent(new Event('click', { bubbles: true }));
        found = true;
      }
    });
    if (!found) {
      filterButtons[0].dispatchEvent(new Event('click', { bubbles: true }));
    }
  }
}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', filterPublications);
} else {
    filterPublications();
}
</script>