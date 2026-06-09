(function () {
    var video = document.getElementById("moviePlayer");
    var cover = document.querySelector(".player-cover");
    var button = document.querySelector(".player-start");

    if (!video || !button) {
        return;
    }

    var stream = video.getAttribute("data-stream");
    var hls = null;
    var attached = false;

    var attach = function () {
        if (attached || !stream) {
            return;
        }

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = stream;
            attached = true;
            return;
        }

        if (window.Hls && window.Hls.isSupported()) {
            hls = new window.Hls();
            hls.loadSource(stream);
            hls.attachMedia(video);
            attached = true;
            return;
        }

        video.src = stream;
        attached = true;
    };

    var play = function () {
        attach();

        if (cover) {
            cover.classList.add("is-hidden");
        }

        var promise = video.play();

        if (promise && typeof promise.catch === "function") {
            promise.catch(function () {});
        }
    };

    button.addEventListener("click", play);

    if (cover) {
        cover.addEventListener("click", play);
    }

    video.addEventListener("click", function () {
        if (video.paused) {
            play();
        }
    });

    window.addEventListener("beforeunload", function () {
        if (hls) {
            hls.destroy();
        }
    });
})();
