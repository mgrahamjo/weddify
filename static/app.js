(() => {

    const $ = selector => document.querySelector(selector) || document.createElement('div');

    const trackMap = {},
        $app = $('.app');

    let status = {},
        fadingOut,
        playlists,
        $playBtn,
        $track,
        $artist,
        $progress;

    const request = url => fetch(`/${url}`)
        .then(res => res.json());

    function updatePlayBtn() {

        const activeTab = $('.tab.active');

        if (status.state === 'playing' && !fadingOut) {

            $playBtn.classList.add('active');

            if (trackMap[status.id]) {

                const tab = document.getElementById(trackMap[status.id]);

                if (!tab.classList.contains('active')) {

                    activeTab.classList.remove('active');

                    tab.classList.add('active');

                }

            } else {

                activeTab.classList.remove('active');

            }

        } else {

            $playBtn.classList.remove('active');

            activeTab.classList.remove('active');

        }

    }

    function update(_status) {

        if (fadingOut) {

            if (_status.state === 'paused') {

                fadingOut = false;

            }

            _status.state = 'paused';

        }

        status = _status;

        updatePlayBtn();

        status = _status;

        $track.textContent = status.name;

        $artist.textContent = status.artist;

        $progress.style.width = status.position / (status.duration / 1000) * 100 + '%';

    }

    const getStatus = () => request('status').then(update);

    const togglePlaylist = e => {

        const el = e.currentTarget;

        if (el.classList.contains('active')) {

            el.classList.remove('active');

            status.state = 'paused';

            fadingOut = true;

            request('pause');

        } else {

            $('.tab.active').classList.remove('active');

            el.classList.add('active');

            status.state = 'playing';

            status.id = el.id;

            fadingOut = false;

            request(`play/${el.id}`);

        }

        updatePlayBtn();

    };

    const togglePlay = () => {

        if (status.state === 'paused') {

            status.state = 'playing';

            fadingOut = false;

            request('play');

        } else {

            status.state = 'paused';

            fadingOut = true;

            request('pause');

        }

        updatePlayBtn();

    };

    const seek = e => {

        const pos = e.currentTarget.getBoundingClientRect();

        const x = e.pageX - pos.left;

        const percentage = x / e.currentTarget.offsetWidth;

        status.position = parseInt(status.duration / 1000 * percentage);

        request(`seek/${status.position}`);

        update(status);

    };

    const prev = () => request('prev');

    const next = () => request('next');

    window.weddify = {
        togglePlaylist,
        togglePlay,
        seek,
        prev,
        next
    };

    request('playlists.json').then(_playlists => {

        playlists = _playlists;

        Object.keys(playlists).forEach(key => {

            playlists[key].tracks.push(key);

            playlists[key].tracks.forEach(track => {

                trackMap[track] = key;

            });

        });

        $app.innerHTML = `
        <div class="tabs">
            ${Object.keys(playlists).map((key, i) => `
                <div class="tab" onclick="weddify.togglePlaylist(event)" id="${key}">
                    <i class="icon-play"></i> <strong>${i + 1}. ${playlists[key].label}</strong> <span>${playlists[key].info}</span>
                </div>`).join('')}
        </div>
        <div class="info">
            <strong class="info-track"></strong>
            <div class="info-artist"></div>
        </div>
        <div class="controls">
            <i class="icon-prev" onclick="weddify.prev()"></i>
            <i class="icon-play" onclick="weddify.togglePlay()"></i>
            <i class="icon-next" onclick="weddify.next()"></i>
            <div class="progress-wrap" onclick="weddify.seek(event)">
                <div class="progress"></div>
            </div>
        </div>`;

        $playBtn = $('.controls .icon-play');
        $track = $('.info-track');
        $artist = $('.info-artist');
        $progress = $('.progress');

        getStatus().then(() => {

            $progress.classList.add('initialized');

            setInterval(getStatus, 2000);

        });

    });

})();
