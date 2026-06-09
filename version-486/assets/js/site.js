(() => {
  const menuButton = document.querySelector('[data-menu-button]');
  const mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
    });
  }

  document.querySelectorAll('[data-nav-search]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      const input = form.querySelector('input[name="q"]');
      const value = input ? input.value.trim() : '';
      if (!value) {
        event.preventDefault();
        window.location.href = './search.html';
      }
    });
  });

  const hero = document.querySelector('[data-hero]');
  if (hero) {
    const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
    const prev = hero.querySelector('[data-hero-prev]');
    const next = hero.querySelector('[data-hero-next]');
    let active = 0;
    let timer = null;

    const show = (index) => {
      active = (index + slides.length) % slides.length;
      slides.forEach((slide, slideIndex) => {
        slide.classList.toggle('active', slideIndex === active);
      });
      dots.forEach((dot, dotIndex) => {
        dot.classList.toggle('active', dotIndex === active);
      });
    };

    const start = () => {
      window.clearInterval(timer);
      timer = window.setInterval(() => show(active + 1), 5000);
    };

    if (slides.length > 1) {
      prev?.addEventListener('click', () => {
        show(active - 1);
        start();
      });
      next?.addEventListener('click', () => {
        show(active + 1);
        start();
      });
      dots.forEach((dot) => {
        dot.addEventListener('click', () => {
          show(Number(dot.dataset.heroDot || '0'));
          start();
        });
      });
      start();
    }
  }

  const filterInput = document.querySelector('[data-filter-input]');
  const filterItems = Array.from(document.querySelectorAll('[data-filter-item]'));

  const applyFilter = (value) => {
    const query = value.trim().toLowerCase();
    filterItems.forEach((item) => {
      const text = (item.dataset.filterText || item.textContent || '').toLowerCase();
      item.classList.toggle('is-hidden', query.length > 0 && !text.includes(query));
    });
  };

  if (filterInput && filterItems.length) {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q') || '';
    if (q) {
      filterInput.value = q;
      applyFilter(q);
    }
    filterInput.addEventListener('input', () => applyFilter(filterInput.value));
  }
})();
