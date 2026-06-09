(function () {
  function initMoviePlayer(videoId, videoUrl) {
    var video = document.getElementById(videoId);
    if (!video) return;
    var shell = video.closest(".player-shell");
    var playButtons = shell ? Array.prototype.slice.call(shell.querySelectorAll("[data-play-action]")) : [];
    var loaded = false;
    var pendingPlay = false;
    var hls = null;

    function showError() {
      if (shell) {
        shell.classList.add("has-error");
      }
    }

    function markPlaying() {
      if (shell) {
        shell.classList.add("is-playing");
      }
      video.controls = true;
    }

    function attemptPlay() {
      markPlaying();
      var promise = video.play();
      if (promise && typeof promise.catch === "function") {
        promise.catch(function () {});
      }
    }

    function loadVideo() {
      if (loaded) return;
      loaded = true;
      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(videoUrl);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
          if (pendingPlay) {
            attemptPlay();
          }
        });
        hls.on(window.Hls.Events.ERROR, function (_, data) {
          if (data && data.fatal) {
            showError();
          }
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = videoUrl;
      } else {
        showError();
      }
    }

    function startPlayback() {
      pendingPlay = true;
      loadVideo();
      attemptPlay();
    }

    playButtons.forEach(function (button) {
      button.addEventListener("click", function (event) {
        event.preventDefault();
        startPlayback();
      });
    });

    video.addEventListener("click", function () {
      if (video.paused) {
        startPlayback();
      }
    });

    video.addEventListener("play", markPlaying);

    window.addEventListener("pagehide", function () {
      if (hls) {
        hls.destroy();
      }
    });
  }

  window.initMoviePlayer = initMoviePlayer;
})();
