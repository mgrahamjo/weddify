#!/bin/bash

cd "$(dirname "$0")"

killall node

/Applications/Spotify.app/Contents/MacOS/Spotify

/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome "http://localhost:8000"

osascript -e 'tell application "Google Chrome" to activate'

node index.js
