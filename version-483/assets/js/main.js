(function () {
  var toggle = document.querySelector('[data-menu-toggle]');
  var panel = document.querySelector('[data-mobile-panel]');

  if (toggle && panel) {
    toggle.addEventListener('click', function () {
      panel.classList.toggle('is-open');
    });
  }

  document.querySelectorAll('.poster-img').forEach(function (image) {
    image.addEventListener('error', function () {
      image.classList.add('is-hidden');
    });
  });

  var slider = document.querySelector('[data-hero-slider]');

  if (slider) {
    var slides = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-dot]'));
    var prev = slider.querySelector('[data-hero-prev]');
    var next = slider.querySelector('[data-hero-next]');
    var index = 0;
    var timer = null;

    function showSlide(nextIndex) {
      if (!slides.length) {
        return;
      }

      index = (nextIndex + slides.length) % slides.length;

      slides.forEach(function (slide, current) {
        slide.classList.toggle('is-active', current === index);
      });

      dots.forEach(function (dot, current) {
        dot.classList.toggle('is-active', current === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        showSlide(index + 1);
      }, 6200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
        start();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        showSlide(index - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        showSlide(index + 1);
        start();
      });
    }

    slider.addEventListener('mouseenter', stop);
    slider.addEventListener('mouseleave', start);
    start();
  }

  var filterGrid = document.querySelector('[data-filter-grid]');

  if (filterGrid) {
    var input = document.querySelector('[data-filter-input]');
    var typeSelect = document.querySelector('[data-filter-type]');
    var yearSelect = document.querySelector('[data-filter-year]');
    var items = Array.prototype.slice.call(filterGrid.querySelectorAll('.movie-card, .rank-row'));

    function filterItems() {
      var query = input ? input.value.trim().toLowerCase() : '';
      var type = typeSelect ? typeSelect.value.trim().toLowerCase() : '';
      var year = yearSelect ? yearSelect.value.trim() : '';

      items.forEach(function (item) {
        var haystack = [
          item.getAttribute('data-title') || '',
          item.getAttribute('data-genre') || '',
          item.getAttribute('data-type') || '',
          item.getAttribute('data-region') || '',
          item.getAttribute('data-year') || ''
        ].join(' ');
        var matchQuery = !query || haystack.indexOf(query) !== -1;
        var matchType = !type || (item.getAttribute('data-type') || '').indexOf(type) !== -1;
        var matchYear = !year || (item.getAttribute('data-year') || '') === year;

        item.classList.toggle('is-filter-hidden', !(matchQuery && matchType && matchYear));
      });
    }

    [input, typeSelect, yearSelect].forEach(function (control) {
      if (control) {
        control.addEventListener('input', filterItems);
        control.addEventListener('change', filterItems);
      }
    });
  }

  var results = document.getElementById('search-results');
  var searchInput = document.getElementById('search-input');
  var searchTitle = document.getElementById('search-title');

  if (results && searchInput && window.movieSearchData) {
    var params = new URLSearchParams(window.location.search);
    var q = params.get('q') || '';
    searchInput.value = q;

    function renderSearch() {
      var query = searchInput.value.trim().toLowerCase();
      var list = window.movieSearchData.filter(function (movie) {
        if (!query) {
          return movie.featured;
        }

        return movie.search.indexOf(query) !== -1;
      }).slice(0, 120);

      if (searchTitle) {
        searchTitle.textContent = query ? '搜索：' + searchInput.value.trim() : '精选推荐';
      }

      results.innerHTML = list.map(function (movie) {
        return [
          '<article class="movie-card">',
          '<a class="poster-link" href="' + movie.url + '" aria-label="观看' + escapeHtml(movie.title) + '">',
          '<span class="poster-media">',
          '<img class="poster-img" src="' + movie.cover + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
          '<span class="play-chip">播放</span>',
          '</span>',
          '</a>',
          '<div class="movie-card-body">',
          '<div class="movie-meta-line"><span>' + escapeHtml(movie.type) + '</span><span>' + escapeHtml(movie.year) + '</span><span>' + escapeHtml(movie.region) + '</span></div>',
          '<h3><a href="' + movie.url + '">' + escapeHtml(movie.title) + '</a></h3>',
          '<p>' + escapeHtml(movie.oneLine) + '</p>',
          '<div class="tag-row">' + movie.tags.map(function (tag) { return '<span>' + escapeHtml(tag) + '</span>'; }).join('') + '</div>',
          '</div>',
          '</article>'
        ].join('');
      }).join('');

      results.querySelectorAll('.poster-img').forEach(function (image) {
        image.addEventListener('error', function () {
          image.classList.add('is-hidden');
        });
      });
    }

    function escapeHtml(value) {
      return String(value).replace(/[&<>"]/g, function (character) {
        return {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;'
        }[character];
      });
    }

    renderSearch();
    searchInput.addEventListener('input', renderSearch);
  }
})();
