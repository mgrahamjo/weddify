#!/bin/bash

cd "$(dirname "$0")"

killall node > /dev/null 2>&1

osascript -e 'tell application "Spotify" to activate'

/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome "http://localhost:8000"

osascript -e 'tell application "Google Chrome" to activate'

node index.js
