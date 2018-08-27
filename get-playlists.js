const fs = require('fs'),
    spotify = require('spotify-node-applescript'),
    playlists = JSON.parse(fs.readFileSync('static/playlists.json')),
    keys = Object.keys(playlists);

let i = 0;

const getTrack = () => setTimeout(() => spotify.getTrack((err, track) => {

    if (err) {

        console.log(err);

    } else {

        const playlist = playlists[keys[i]];

        if (playlist.tracks.indexOf(track.id) === -1) {

            console.log('    got track ' + track.name);

            playlist.tracks.push(track.id);

            spotify.next(getTrack);

        } else {

            i++;

            getPlayList();

        }

    }

}), 1000);

function save() {

    fs.writeFileSync('static/playlists.json', JSON.stringify(playlists, null, '\t'));

}

function getPlayList() {

    const playlist = playlists[keys[i]];

    if (playlist) {

        playlist.tracks = [];

        save();

        console.log('getting playlist ' + playlist.label + '...');

        spotify.playTrack(playlist.uri, getTrack);

    } else {

        save();

        spotify.setVolume(100, () => console.log('done.'));

    }

}

spotify.setVolume(0, getPlayList);
