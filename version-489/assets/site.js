(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  ready(function () {
    var menuButton = document.querySelector("[data-mobile-menu-button]");
    var mobilePanel = document.querySelector("[data-mobile-panel]");
    if (menuButton && mobilePanel) {
      menuButton.addEventListener("click", function () {
        mobilePanel.classList.toggle("is-open");
      });
    }

    var hero = document.querySelector("[data-hero]");
    if (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
      var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
      var index = 0;
      var timer = null;

      function showSlide(nextIndex) {
        if (!slides.length) {
          return;
        }
        index = (nextIndex + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
          slide.classList.toggle("is-active", slideIndex === index);
        });
        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle("is-active", dotIndex === index);
        });
      }

      function startTimer() {
        if (timer) {
          window.clearInterval(timer);
        }
        timer = window.setInterval(function () {
          showSlide(index + 1);
        }, 5200);
      }

      dots.forEach(function (dot, dotIndex) {
        dot.addEventListener("click", function () {
          showSlide(dotIndex);
          startTimer();
        });
      });

      showSlide(0);
      startTimer();
    }

    var filterBar = document.querySelector("[data-filter-bar]");
    if (filterBar) {
      var search = filterBar.querySelector("[data-filter-search]");
      var year = filterBar.querySelector("[data-filter-year]");
      var type = filterBar.querySelector("[data-filter-type]");
      var cards = Array.prototype.slice.call(document.querySelectorAll("[data-filter-grid] [data-movie-card]"));

      function applyFilters() {
        var query = search ? search.value.trim().toLowerCase() : "";
        var selectedYear = year ? year.value : "";
        var selectedType = type ? type.value : "";
        cards.forEach(function (card) {
          var title = (card.getAttribute("data-title") || "").toLowerCase();
          var cardYear = card.getAttribute("data-year") || "";
          var cardType = card.getAttribute("data-type") || "";
          var genre = (card.getAttribute("data-genre") || "").toLowerCase();
          var tags = (card.getAttribute("data-tags") || "").toLowerCase();
          var textMatch = !query || title.indexOf(query) >= 0 || genre.indexOf(query) >= 0 || tags.indexOf(query) >= 0;
          var yearMatch = !selectedYear || cardYear === selectedYear;
          var typeMatch = !selectedType || cardType === selectedType;
          card.classList.toggle("is-hidden", !(textMatch && yearMatch && typeMatch));
        });
      }

      [search, year, type].forEach(function (element) {
        if (element) {
          element.addEventListener("input", applyFilters);
          element.addEventListener("change", applyFilters);
        }
      });
    }

    var searchPage = document.querySelector("[data-search-page]");
    if (searchPage && window.movieSearchData) {
      var form = searchPage.querySelector(".search-page-form");
      var input = searchPage.querySelector("[data-search-input]");
      var results = searchPage.querySelector("[data-search-results]");
      var meta = searchPage.querySelector("[data-search-meta]");
      var params = new URLSearchParams(window.location.search);
      var currentQuery = params.get("q") || "";
      if (input) {
        input.value = currentQuery;
      }

      function escapeHtml(value) {
        return String(value).replace(/[&<>"]/g, function (char) {
          return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            """: "&quot;"
          }[char];
        });
      }

      function renderCard(movie) {
        var tags = movie.tags.slice(0, 3).map(function (tag) {
          return "<span>" + escapeHtml(tag) + "</span>";
        }).join("");
        return "<a class="movie-card" href="./" + escapeHtml(movie.file) + "">" +
          "<div class="movie-cover"><img src="" + escapeHtml(movie.cover) + "" alt="" + escapeHtml(movie.title) + "" loading="lazy"><span class="play-hover">▶</span></div>" +
          "<div class="movie-card-body"><h3>" + escapeHtml(movie.title) + "</h3><p>" + escapeHtml(movie.oneLine) + "</p>" +
          "<div class="movie-card-meta"><span>" + escapeHtml(movie.year) + "</span><span>" + escapeHtml(movie.type) + "</span><span>" + escapeHtml(movie.region) + "</span></div>" +
          "<div class="movie-card-tags">" + tags + "</div></div></a>";
      }

      function searchMovies(query) {
        var normalized = query.trim().toLowerCase();
        var matched = window.movieSearchData.filter(function (movie) {
          if (!normalized) {
            return true;
          }
          return movie.searchText.indexOf(normalized) >= 0;
        }).slice(0, 120);
        if (results) {
          results.innerHTML = matched.map(renderCard).join("");
        }
        if (meta) {
          meta.textContent = normalized ? "搜索结果：" + matched.length + " 部" : "精选影片";
        }
      }

      if (form && input) {
        form.addEventListener("submit", function (event) {
          event.preventDefault();
          var query = input.value.trim();
          var nextUrl = query ? "./search.html?q=" + encodeURIComponent(query) : "./search.html";
          window.history.replaceState(null, "", nextUrl);
          searchMovies(query);
        });
        input.addEventListener("input", function () {
          searchMovies(input.value);
        });
      }

      searchMovies(currentQuery);
    }
  });
})();
