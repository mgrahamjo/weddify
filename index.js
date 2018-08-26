const spotify = require('spotify-node-applescript');
const serve = require('./server/serve');

process.chdir(__dirname + '/static');

const playlists = {
    waitingMusic: 'spotify:user:1224314128:playlist:0FKBmEzljxo48hDDlC33v4',
    processional: 'spotify:user:1249317563:playlist:46p1416o3bQZfQrf2ePUJf',
    brideProcessional: 'spotify:user:1249317563:playlist:0fLHtf5v6yt6kLskPIAn9z',
    recessional: 'spotify:user:1249317563:playlist:2fQeChEV3NEUE3LCTz7KUm',
    cocktailHour: 'spotify:user:1224314128:playlist:20kmQFo1ygHgfuhPJs0yN1',
    dinner: 'spotify:user:1224314128:playlist:4SgvaFXN7NbOMITlVCV9gg',
    cakeCutting: 'spotify:user:1249317563:playlist:3kY91vYPzgVXuWr16TRnuv',
    fatherDaughter: 'spotify:user:1249317563:playlist:5F306qPc8AYhuhnRDI9nJJ',
    firstDance: 'spotify:user:1249317563:playlist:3oRw10tfLMUPyO6VL9mh40',
    dancing: 'spotify:user:1224314128:playlist:7sz3QFwpmZ3LnxJN5mxioS'
};

let timer;

const turnUpVolumeAnd = fn => {

    clearTimeout(timer);

    spotify.setVolume(100, fn);

};

const play = (send, id) => turnUpVolumeAnd(() => {

    if (id) {
        
        spotify.playTrack(playlists[id], () => send(200));

    } else {
        
        spotify.play(() => send(200));

    }

});

function fadeOut(volume = 100) {

    if (volume <= 0) {

        return spotify.pause();

    }

    spotify.setVolume(volume);

    timer = setTimeout(() => fadeOut(volume - 1), 60);

}

const pause = send => {

    clearTimeout(timer);

    send(200);

    spotify.getState((err, ctx) => {

        if (ctx.state === 'playing') {

            fadeOut(ctx.volume);

        }

    });

};

const getTrack = send => spotify.getTrack((err, data) => send(200, data));

const status = send => spotify.getTrack((err, track) => {

    if (err) {

        console.log(err);

        send(500, err);

    } else {

        spotify.getState((_err, state) => {

            if (_err) {

                console.error(_err);

                send(500, _err);

            } else {
            
                send(200, Object.assign(track, state));

            }
        });

    }

});

const seek = (send, time) => turnUpVolumeAnd(() => {

    spotify.jumpTo(time, () => send(200));

});

const next = send => turnUpVolumeAnd(() => spotify.next(() => send(200)));

const prev = send => turnUpVolumeAnd(() => spotify.previous(() => send(200)));

const routes = {
    play,
    pause,
    getTrack,
    status,
    seek,
    next,
    prev
};

serve(routes);
