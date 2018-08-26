const playlists = {
    waitingMusic: {
        label: 'Waiting Music',
        info: 'Play while guests are being seated before the ceremony'
    },
    processional: {
        label: 'Processional',
        info: 'Play when the wedding party walks down the isle'
    },
    brideProcessional: {
        label: 'Bride\'s Processional',
        info: 'Play when Hannah walks down the isle'
    },
    recessional: {
        label: 'Recessional',
        info: 'Play when the ceremony ends'
    },
    cocktailHour: {
        label: 'Cocktail Hour',
        info: 'Play during cocktail hour'
    },
    dinner: {
        label: 'Dinner',
        info: 'Play during dinner'
    },
    cakeCutting: {
        label: 'Cake Cutting',
        info: 'Play when we cut the cake'
    },
    fatherDaughter: {
        label: 'Father Daughter Dance',
        info: 'Play during thte father daughter dance'
    },
    firstDance: {
        label: 'First Dance',
        info: 'Play during Mike and Hannah\'s first dance'
    },
    dancing: {
        label: 'Dance Music',
        info: 'Dance music!'
    }
};

let status = {};

let fadingOut;

const send = url => fetch(`/${url}`)
    .then(res => res.json());

function updatePlayBtn() {

    $playBtn.classList[status.state === 'playing' ? 'add' : 'remove']('active');

}

function update(_status) {

    if (fadingOut) {

        if (_status.state === 'paused') {

            fadingOut = false;

        }

        _status.state = 'paused';

    }

    if (_status.state !== status.state) {

        status = _status;

        updatePlayBtn();

    }

    status = _status;

    console.log(status);

    $track.textContent = status.name;

    $artist.textContent = status.artist;

    $progress.style.width = status.position / (status.duration / 1000) * 100 + '%';

}

function getStatus() {

    send('status').then(update);

}

getStatus();

setInterval(getStatus, 2000);

setTimeout(() => $progress.classList.add('initialized'), 2500);

const $ = selector => document.querySelector(selector) || document.createElement('div');

const $app = $('.app');

const togglePlaylist = (e, key) => {

    $('.tab.active').classList.remove('active');

    if (e.currentTarget.classList.contains('active')) {

        status.state = 'paused';

        send('pause');

        fadingOut = true;

    } else {

        e.currentTarget.classList.add('active');

        status.state = 'playing';

        send(`play/${key}`);

        fadingOut = false;

    }

    updatePlayBtn();

};

const togglePlay = () => {

    if (status.state === 'paused') {

        status.state = 'playing';

        fadingOut = false;

        send('play');

    } else {

        $('.tab.active').classList.remove('active');

        status.state = 'paused';

        fadingOut = true;

        send('pause');

    }

    updatePlayBtn();

};

const seek = e => {

    const pos = e.currentTarget.getBoundingClientRect();

    const x = e.pageX - pos.left;

    const percentage = x / e.currentTarget.offsetWidth;

    status.position = parseInt(status.duration / 1000 * percentage);

    send(`seek/${status.position}`);

    update(status);

};

const prev = () => send('prev');

const next = () => send('next');

window.weddify = {
    togglePlaylist,
    togglePlay,
    seek,
    prev,
    next
};

$app.innerHTML = `
<div class="tabs">
    ${Object.keys(playlists).map((key, i) => `<div class="tab" onclick="weddify.togglePlaylist(event, '${key}')"><i class="icon-play"></i> <strong>${i + 1}. ${playlists[key].label}</strong> <span>${playlists[key].info}</span></div>`).join('')}
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

const $playBtn = $('.controls .icon-play'),
    $track = $('.info-track'),
    $artist = $('.info-artist'),
    $progress = $('.progress');
