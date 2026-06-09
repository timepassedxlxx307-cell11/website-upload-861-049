(function () {
  var video = document.getElementById('movie-player');
  var button = document.querySelector('.js-play-button');

  if (!video) {
    return;
  }

  var stream = video.getAttribute('data-stream');
  var ready = false;

  function loadStream() {
    if (ready || !stream) {
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });

      hls.loadSource(stream);
      hls.attachMedia(video);
      video.hlsInstance = hls;
      ready = true;
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = stream;
      ready = true;
    }
  }

  function playMovie() {
    loadStream();

    var promise = video.play();

    if (promise && typeof promise.catch === 'function') {
      promise.catch(function () {});
    }
  }

  video.addEventListener('click', playMovie);
  video.addEventListener('play', function () {
    if (button) {
      button.classList.add('is-hidden');
    }
  });
  video.addEventListener('pause', function () {
    if (button && video.currentTime === 0) {
      button.classList.remove('is-hidden');
    }
  });

  if (button) {
    button.addEventListener('click', playMovie);
  }

  loadStream();
})();
