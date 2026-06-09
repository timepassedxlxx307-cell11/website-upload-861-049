(() => {
  const players = Array.from(document.querySelectorAll('[data-player]'));

  players.forEach((player) => {
    const video = player.querySelector('video');
    const button = player.querySelector('[data-play-button]');
    const stream = player.dataset.stream || '';
    let ready = false;
    let hls = null;

    const attach = () => {
      if (!video || ready || !stream) {
        return;
      }

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
        ready = true;
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hls.loadSource(stream);
        hls.attachMedia(video);
        ready = true;
      }
    };

    const play = () => {
      if (!video) {
        return;
      }

      attach();
      video.controls = true;
      player.classList.add('is-playing');
      const attempt = video.play();
      if (attempt && typeof attempt.catch === 'function') {
        attempt.catch(() => {
          player.classList.remove('is-playing');
        });
      }
    };

    button?.addEventListener('click', play);
    video?.addEventListener('click', () => {
      if (!ready || video.paused) {
        play();
      }
    });
    window.addEventListener('pagehide', () => {
      if (hls && typeof hls.destroy === 'function') {
        hls.destroy();
      }
    });
  });
})();
