# Scores Inspector

A visualizer web app that consumes data from the osu!alternative Discord: https://discord.gg/VZWRZZXcW4

This repository is used in conjunction with the server-side repository (https://github.com/darkchii/osu-api) for fetching users, beatmaps etc.
Most processing is done client-side however.

## Software dependencies
- Node v16.16.0
- npm 8.11.0

## Running and building
- Configure `src/config.json` if necessary
- For running a build, make sure an instance of `osu-api` is also active on the local machine
- Run `npm start` to run
- Run `npm run build` to compile to a build
