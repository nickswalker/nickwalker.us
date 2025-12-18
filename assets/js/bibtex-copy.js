function toggleBibtex(key) {
    var element = document.getElementById('bibtex-' + key);
    if (element.style.display === 'none') {
        element.style.display = 'block';
    } else {
        element.style.display = 'none';
    }
}

function copyBibtex(key) {
    var element = document.getElementById('bibtex-content-' + key);
    var text = element.innerText || element.textContent;
    navigator.clipboard.writeText(text).then(function() {
        var button = document.getElementById('copy-btn-' + key);
        var originalText = button.innerText;
        button.innerText = 'Copied!';
        button.classList.remove('btn-outline-secondary');
        button.classList.add('btn-success');
        setTimeout(function() {
            button.innerText = 'Copy';
            button.classList.remove('btn-success');
            button.classList.add('btn-outline-secondary');
        }, 2000);
    }, function(err) {
        console.error('Could not copy text: ', err);
    });
}
