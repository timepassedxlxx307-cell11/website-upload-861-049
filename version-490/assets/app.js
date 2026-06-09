(() => {
  const menuButton = document.querySelector('[data-menu-toggle]');
  const mobilePanel = document.querySelector('[data-mobile-panel]');

  if (menuButton && mobilePanel) {
    menuButton.addEventListener('click', () => {
      mobilePanel.classList.toggle('is-open');
    });
  }

  document.querySelectorAll('[data-site-search]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      const input = form.querySelector('input[name="q"]');
      if (!input || !input.value.trim()) {
        event.preventDefault();
        return;
      }
      input.value = input.value.trim();
    });
  });

  const slider = document.querySelector('[data-hero-slider]');
  if (slider) {
    const slides = Array.from(slider.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(slider.querySelectorAll('[data-hero-dot]'));
    const prev = slider.querySelector('[data-hero-prev]');
    const next = slider.querySelector('[data-hero-next]');
    let current = 0;
    let timer = null;

    const show = (index) => {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach((slide, slideIndex) => {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach((dot, dotIndex) => {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    };

    const start = () => {
      timer = window.setInterval(() => show(current + 1), 5600);
    };

    const restart = () => {
      window.clearInterval(timer);
      start();
    };

    dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        show(Number(dot.dataset.heroDot || 0));
        restart();
      });
    });

    if (prev) {
      prev.addEventListener('click', () => {
        show(current - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener('click', () => {
        show(current + 1);
        restart();
      });
    }

    start();
  }

  const filterInput = document.querySelector('[data-filter-input]');
  const clearFilter = document.querySelector('[data-clear-filter]');
  const cards = Array.from(document.querySelectorAll('.movie-card'));

  const applyFilter = (value) => {
    const words = value.trim().toLowerCase().split(/\s+/).filter(Boolean);
    cards.forEach((card) => {
      const haystack = (card.dataset.search || card.textContent || '').toLowerCase();
      const matched = words.every((word) => haystack.includes(word));
      card.classList.toggle('is-hidden', !matched);
    });
  };

  if (filterInput) {
    const params = new URLSearchParams(window.location.search);
    const query = params.get('q') || '';
    if (query) {
      filterInput.value = query;
      applyFilter(query);
    }
    filterInput.addEventListener('input', () => applyFilter(filterInput.value));
  }

  if (clearFilter && filterInput) {
    clearFilter.addEventListener('click', () => {
      filterInput.value = '';
      applyFilter('');
      filterInput.focus();
    });
  }

  document.querySelectorAll('[data-player]').forEach((player) => {
    const video = player.querySelector('video');
    const button = player.querySelector('.play-overlay');
    const stream = player.dataset.stream;
    let attached = false;
    let hls = null;

    const attach = () => {
      if (!video || !stream || attached) {
        return;
      }
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hls.loadSource(stream);
        hls.attachMedia(video);
      } else {
        video.src = stream;
      }
      attached = true;
    };

    const play = () => {
      attach();
      player.classList.add('is-playing');
      const attempt = video.play();
      if (attempt && typeof attempt.catch === 'function') {
        attempt.catch(() => {
          player.classList.remove('is-playing');
        });
      }
    };

    if (button) {
      button.addEventListener('click', play);
    }

    if (video) {
      video.addEventListener('click', () => {
        if (video.paused) {
          play();
        }
      });
      video.addEventListener('play', () => player.classList.add('is-playing'));
      video.addEventListener('pause', () => {
        if (!video.currentTime) {
          player.classList.remove('is-playing');
        }
      });
    }

    window.addEventListener('beforeunload', () => {
      if (hls) {
        hls.destroy();
      }
    });
  });
})();
