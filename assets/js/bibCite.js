function revealCiteToggles() {
  document.querySelectorAll('.cite-toggle-item').forEach(function(el) {
    el.hidden = false;
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', revealCiteToggles);
} else {
  revealCiteToggles();
}

document.addEventListener('click', function(e) {
  var toggle = e.target.closest('.cite-toggle');
  if (toggle) {
    e.preventDefault();
    var block = document.getElementById(toggle.dataset.target);
    if (block) block.hidden = !block.hidden;
    return;
  }
  var copy = e.target.closest('.cite-copy');
  if (copy) {
    e.preventDefault();
    var pre = document.getElementById(copy.dataset.target);
    if (!pre || !navigator.clipboard) return;
    navigator.clipboard.writeText(pre.textContent.trim()).then(function() {
      var orig = copy.textContent;
      copy.textContent = 'Copied';
      copy.disabled = true;
      setTimeout(function() {
        copy.textContent = orig;
        copy.disabled = false;
      }, 1500);
    });
  }
});