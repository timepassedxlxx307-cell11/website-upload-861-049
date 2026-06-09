import { H as Hls } from './hls-dru42stk.js';

export function setupPlayer(options) {
  var video = document.querySelector(options.videoSelector);
  var overlay = document.querySelector(options.overlaySelector);
  var button = document.querySelector(options.buttonSelector);
  var errorBox = document.querySelector(options.errorSelector);
  var hlsInstance = null;
  var attached = false;

  if (!video || !options.source) {
    return;
  }

  function showError() {
    if (errorBox) {
      errorBox.textContent = '播放暂时不可用，请稍后重试。';
      errorBox.classList.add('is-visible');
    }
  }

  function attachMedia() {
    if (attached) {
      return;
    }

    attached = true;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = options.source;
      return;
    }

    if (Hls && Hls.isSupported()) {
      hlsInstance = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      hlsInstance.loadSource(options.source);
      hlsInstance.attachMedia(video);
      hlsInstance.on(Hls.Events.ERROR, function (eventName, data) {
        if (data && data.fatal) {
          showError();
        }
      });
      return;
    }

    video.src = options.source;
  }

  function hideOverlay() {
    if (overlay) {
      overlay.classList.add('is-hidden');
    }
  }

  function beginPlay(event) {
    if (event) {
      event.preventDefault();
    }
    attachMedia();
    hideOverlay();
    var playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function () {
        showError();
      });
    }
  }

  function togglePlay() {
    if (video.paused) {
      beginPlay();
    } else {
      video.pause();
    }
  }

  attachMedia();

  if (overlay) {
    overlay.addEventListener('click', beginPlay);
  }

  if (button) {
    button.addEventListener('click', beginPlay);
  }

  video.addEventListener('click', togglePlay);
  video.addEventListener('play', hideOverlay);
  video.addEventListener('error', showError);

  window.addEventListener('pagehide', function () {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
  });
}
