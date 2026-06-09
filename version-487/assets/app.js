(function () {
    function ready(fn) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fn);
        } else {
            fn();
        }
    }

    function setupMenu() {
        var button = document.querySelector('.menu-toggle');
        var nav = document.querySelector('.site-nav');
        if (!button || !nav) {
            return;
        }
        button.addEventListener('click', function () {
            nav.classList.toggle('is-open');
        });
    }

    function setupHero() {
        var root = document.querySelector('[data-hero-carousel]');
        if (!root) {
            return;
        }
        var slides = Array.prototype.slice.call(root.querySelectorAll('.hero-slide'));
        var dots = Array.prototype.slice.call(root.querySelectorAll('.hero-dot'));
        var prev = root.querySelector('[data-hero-prev]');
        var next = root.querySelector('[data-hero-next]');
        var index = 0;
        var timer = null;

        function show(nextIndex) {
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
                show(index + 1);
            }, 5000);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        if (prev) {
            prev.addEventListener('click', function () {
                show(index - 1);
                start();
            });
        }
        if (next) {
            next.addEventListener('click', function () {
                show(index + 1);
                start();
            });
        }
        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                show(Number(dot.getAttribute('data-slide') || 0));
                start();
            });
        });
        root.addEventListener('mouseenter', stop);
        root.addEventListener('mouseleave', start);
        show(0);
        start();
    }

    function setupSearch() {
        var input = document.getElementById('movie-search-input');
        var results = document.querySelector('[data-search-results]');
        if (!input || !results) {
            return;
        }
        var cards = Array.prototype.slice.call(results.querySelectorAll('.movie-card'));
        var chips = Array.prototype.slice.call(document.querySelectorAll('[data-filter-category]'));
        var params = new URLSearchParams(window.location.search);
        var activeCategory = 'all';
        var initial = params.get('q') || '';
        input.value = initial;

        function apply() {
            var keyword = input.value.trim().toLowerCase();
            cards.forEach(function (card) {
                var text = card.getAttribute('data-search-text') || '';
                var category = card.getAttribute('data-category') || '';
                var matchText = !keyword || text.indexOf(keyword) !== -1;
                var matchCategory = activeCategory === 'all' || category === activeCategory;
                card.classList.toggle('is-filter-hidden', !(matchText && matchCategory));
            });
        }

        input.addEventListener('input', apply);
        chips.forEach(function (chip) {
            chip.addEventListener('click', function () {
                activeCategory = chip.getAttribute('data-filter-category') || 'all';
                chips.forEach(function (item) {
                    item.classList.toggle('is-active', item === chip);
                });
                apply();
            });
        });
        apply();
    }

    window.initMoviePlayer = function (options) {
        var root = document.getElementById(options.rootId);
        var video = document.getElementById(options.videoId);
        var overlay = document.getElementById(options.overlayId);
        if (!root || !video || !overlay || !options.source) {
            return;
        }
        var hls = null;
        var attached = false;

        function attach() {
            if (attached) {
                return;
            }
            attached = true;
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = options.source;
                return;
            }
            if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true,
                    backBufferLength: 90
                });
                hls.loadSource(options.source);
                hls.attachMedia(video);
                return;
            }
            video.src = options.source;
        }

        function start() {
            attach();
            video.controls = true;
            overlay.classList.add('is-hidden');
            var playback = video.play();
            if (playback && typeof playback.catch === 'function') {
                playback.catch(function () {
                    overlay.classList.remove('is-hidden');
                });
            }
        }

        overlay.addEventListener('click', start);
        video.addEventListener('click', function () {
            if (video.paused) {
                start();
            }
        });
        window.addEventListener('pagehide', function () {
            if (hls) {
                hls.destroy();
                hls = null;
            }
        });
    };

    ready(function () {
        setupMenu();
        setupHero();
        setupSearch();
    });
})();
