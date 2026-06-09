(function () {
  function selectAll(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function setupMenu() {
    var button = document.querySelector('.menu-toggle');
    var panel = document.querySelector('.mobile-panel');
    if (!button || !panel) {
      return;
    }
    button.addEventListener('click', function () {
      panel.classList.toggle('is-open');
    });
  }

  function setupHero() {
    var slides = selectAll('.hero-slide');
    var dots = selectAll('.hero-dot');
    if (!slides.length) {
      return;
    }
    var current = 0;
    var timer = null;
    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === current);
      });
    }
    function start() {
      if (timer) {
        clearInterval(timer);
      }
      timer = setInterval(function () {
        show(current + 1);
      }, 5200);
    }
    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        var index = Number(dot.getAttribute('data-slide') || 0);
        show(index);
        start();
      });
    });
    show(0);
    start();
  }

  function textOf(card) {
    return (card.textContent || '').toLowerCase();
  }

  function setupClientFilter() {
    var input = document.querySelector('.client-filter');
    var list = document.querySelector('[data-filter-list]');
    if (!input || !list) {
      return;
    }
    var items = selectAll('a', list);
    input.addEventListener('input', function () {
      var keyword = input.value.trim().toLowerCase();
      items.forEach(function (item) {
        item.classList.toggle('is-hidden', keyword && textOf(item).indexOf(keyword) === -1);
      });
    });
  }

  function createCard(movie) {
    var tags = (movie.tags || []).slice(0, 2).map(function (tag) {
      return '<span>' + escapeHtml(tag) + '</span>';
    }).join('');
    return [
      '<a class="movie-card" href="./' + escapeHtml(movie.file) + '">',
      '<span class="card-cover" style="--poster-image: url(\'' + escapeHtml(movie.cover) + '\');">',
      '<span class="play-chip">播放</span>',
      '<span class="card-year">' + escapeHtml(movie.year) + '</span>',
      '</span>',
      '<span class="card-body">',
      '<strong>' + escapeHtml(movie.title) + '</strong>',
      '<em>' + escapeHtml(movie.region) + ' · ' + escapeHtml(movie.type) + ' · ' + escapeHtml(movie.genre) + '</em>',
      '<span class="card-desc">' + escapeHtml(movie.line) + '</span>',
      '<span class="tag-row">' + tags + '</span>',
      '</span>',
      '</a>'
    ].join('');
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[char];
    });
  }

  function setupSearchPage() {
    var form = document.querySelector('[data-search-form]');
    var results = document.querySelector('[data-search-results]');
    if (!form || !results || !window.SEARCH_MOVIES) {
      return;
    }
    var input = form.querySelector('input[name="q"]');
    var params = new URLSearchParams(window.location.search);
    var query = params.get('q') || '';
    if (query) {
      input.value = query;
    }
    function render(keyword) {
      var lower = keyword.trim().toLowerCase();
      var data = window.SEARCH_MOVIES.filter(function (movie) {
        if (!lower) {
          return true;
        }
        return movie.search.indexOf(lower) !== -1;
      }).slice(0, 120);
      results.innerHTML = data.map(createCard).join('');
    }
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      render(input.value);
      var next = new URL(window.location.href);
      if (input.value.trim()) {
        next.searchParams.set('q', input.value.trim());
      } else {
        next.searchParams.delete('q');
      }
      window.history.replaceState({}, '', next.toString());
    });
    selectAll('[data-search-tag]').forEach(function (button) {
      button.addEventListener('click', function () {
        input.value = button.getAttribute('data-search-tag') || '';
        render(input.value);
      });
    });
    render(input.value);
  }

  document.addEventListener('DOMContentLoaded', function () {
    setupMenu();
    setupHero();
    setupClientFilter();
    setupSearchPage();
  });
})();
