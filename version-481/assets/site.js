(function () {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.querySelector(".site-nav");

    if (toggle && nav) {
        toggle.addEventListener("click", function () {
            var opened = nav.classList.toggle("is-open");
            toggle.setAttribute("aria-expanded", opened ? "true" : "false");
        });
    }

    var hero = document.querySelector("[data-hero]");

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
        var prev = hero.querySelector("[data-hero-prev]");
        var next = hero.querySelector("[data-hero-next]");
        var current = 0;
        var timer = null;

        var show = function (index) {
            if (!slides.length) {
                return;
            }

            current = (index + slides.length) % slides.length;

            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === current);
            });

            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === current);
            });
        };

        var restart = function () {
            if (timer) {
                clearInterval(timer);
            }

            timer = setInterval(function () {
                show(current + 1);
            }, 5000);
        };

        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                show(Number(dot.getAttribute("data-hero-dot")) || 0);
                restart();
            });
        });

        if (prev) {
            prev.addEventListener("click", function () {
                show(current - 1);
                restart();
            });
        }

        if (next) {
            next.addEventListener("click", function () {
                show(current + 1);
                restart();
            });
        }

        restart();
    }

    var panels = Array.prototype.slice.call(document.querySelectorAll("[data-filter-panel]"));

    panels.forEach(function (panel) {
        var keyword = panel.querySelector("[data-filter-keyword]");
        var year = panel.querySelector("[data-filter-year]");
        var type = panel.querySelector("[data-filter-type]");
        var list = document.querySelector("[data-card-list]");
        var empty = document.querySelector("[data-empty-state]");

        if (!list) {
            return;
        }

        var cards = Array.prototype.slice.call(list.children);

        var apply = function () {
            var query = keyword ? keyword.value.trim().toLowerCase() : "";
            var selectedYear = year ? year.value : "";
            var selectedType = type ? type.value : "";
            var shown = 0;

            cards.forEach(function (card) {
                var text = (card.textContent + " " + Array.prototype.map.call(card.attributes, function (attr) {
                    return attr.value;
                }).join(" ")).toLowerCase();
                var ok = true;

                if (query && text.indexOf(query) === -1) {
                    ok = false;
                }

                if (selectedYear && card.getAttribute("data-year") !== selectedYear) {
                    ok = false;
                }

                if (selectedType && (card.getAttribute("data-type") || "").indexOf(selectedType) === -1) {
                    ok = false;
                }

                card.classList.toggle("hidden-by-filter", !ok);

                if (ok) {
                    shown += 1;
                }
            });

            if (empty) {
                empty.style.display = shown ? "none" : "block";
            }
        };

        [keyword, year, type].forEach(function (control) {
            if (control) {
                control.addEventListener("input", apply);
                control.addEventListener("change", apply);
            }
        });

        var params = new URLSearchParams(window.location.search);
        var initialQuery = params.get("q");

        if (initialQuery && keyword) {
            keyword.value = initialQuery;
            apply();
        }
    });
})();
