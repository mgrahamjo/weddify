# Weddify

Weddify solves a few problems I had:
- I can't afford a DJ for my wedding
- I had all the music for the wedding in Spotify playlists
- Spotify doesn't have a fade out option, which various parts of the wedding require
- There won't be Internet access at the wedding

![weddify](https://raw.githubusercontent.com/mgrahamjo/weddify/master/static/weddify.png)

It provides an idiot-proof web interface which allows you to click on a playlist to play it. If you pause at any time, it will slowly fade out.

## Installation

Weddify is Mac only.

- `git clone https://github.com/mgrahamjo/weddify && cd weddify && npm install`
- Update `static/playlists.json` with the playlist information for your wedding.
  - You can leave out the `tracks` lists for each playlist and run `node get-playlists` to auto-populate them.

## Usage:

- Open Spotify
- Run `node index`
- Visit http://localhost:8000

## Spotify settings for my wedding:

- Disable display sleeping in System Preferences > Energy Saver
- Turn off shuffle
- In settings:
  - Turn off "Autoplay similar songs when your music ends."
  - Click "Show advanced settings"
  - Turn on "Crossfade songs" and set to "5 sec"
