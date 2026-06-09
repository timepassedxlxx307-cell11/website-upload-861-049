(function () {
  function setupPlayer(player) {
    var video = player.querySelector('video');
    var button = player.querySelector('.play-button');
    var hls = null;
    var ready = false;
    if (!video || !button) {
      return;
    }
    function begin() {
      var src = player.getAttribute('data-src');
      if (!src) {
        return;
      }
      player.classList.add('is-playing');
      if (!ready) {
        ready = true;
        if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 90
          });
          hls.loadSource(src);
          hls.attachMedia(video);
          hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
            video.play().catch(function () {});
          });
        } else {
          video.src = src;
          video.addEventListener('loadedmetadata', function () {
            video.play().catch(function () {});
          }, { once: true });
          video.load();
        }
      } else {
        video.play().catch(function () {});
      }
    }
    button.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      begin();
    });
    player.addEventListener('click', function (event) {
      if (event.target === video && ready) {
        return;
      }
      begin();
    });
    video.addEventListener('play', function () {
      player.classList.add('is-playing');
    });
    video.addEventListener('pause', function () {
      if (video.currentTime === 0 || video.ended) {
        player.classList.remove('is-playing');
      }
    });
    window.addEventListener('beforeunload', function () {
      if (hls && hls.destroy) {
        hls.destroy();
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    Array.prototype.slice.call(document.querySelectorAll('[data-player]')).forEach(setupPlayer);
  });
})();
