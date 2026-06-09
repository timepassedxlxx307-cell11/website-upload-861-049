(function () {
  function selectAll(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  var mobileToggle = document.querySelector('[data-mobile-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (mobileToggle && mobileNav) {
    mobileToggle.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = selectAll('[data-hero-slide]', hero);
    var dots = selectAll('[data-hero-dot]', hero);
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var activeIndex = 0;

    function setSlide(index) {
      if (!slides.length) {
        return;
      }
      activeIndex = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === activeIndex);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === activeIndex);
      });
    }

    if (prev) {
      prev.addEventListener('click', function () {
        setSlide(activeIndex - 1);
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        setSlide(activeIndex + 1);
      });
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        setSlide(dotIndex);
      });
    });

    setInterval(function () {
      setSlide(activeIndex + 1);
    }, 5600);
  }

  var query = new URLSearchParams(window.location.search).get('q') || '';
  var inputs = selectAll('[data-live-search]');

  function normalize(value) {
    return (value || '').toString().trim().toLowerCase();
  }

  function applySearch(input) {
    var scope = document.querySelector('[data-card-scope]') || document;
    var cards = selectAll('.movie-card', scope);
    var countNode = document.querySelector('[data-result-count]');
    var keyword = normalize(input.value);
    var visible = 0;

    cards.forEach(function (card) {
      var haystack = normalize([
        card.getAttribute('data-title'),
        card.getAttribute('data-tags'),
        card.getAttribute('data-year'),
        card.getAttribute('data-region')
      ].join(' '));
      var matched = !keyword || haystack.indexOf(keyword) !== -1;
      card.style.display = matched ? '' : 'none';
      if (matched) {
        visible += 1;
      }
    });

    if (countNode) {
      countNode.textContent = visible + ' 部';
    }
  }

  inputs.forEach(function (input) {
    if (query && !input.value) {
      input.value = query;
    }
    applySearch(input);
    input.addEventListener('input', function () {
      applySearch(input);
    });
  });
}());
