# FeishinToTunaBridge

This is a Feishin to Tuna bridge. Tuna is an [OBS Plugin](https://obsproject.com/forum/resources/tuna.843/) that "​Lets you display information about the currently playing song in obs without running a separate program". [Feishin](https://github.com/jeffvli/feishin) is a music player for self-hosted instances such as Jellyfin

This bridge makes use of the remote control server built into Feishin that lets you request currently playing data, as well as control the client. We take this data, and send it to the webserver port that Tuna opens, which is normally used by the [web browser script](https://github.com/univrsal/tuna/raw/master/deps/tuna_browser.user.js) that you use with Tuna.

# Using

As of right now I don't really have a way to package this as a program yet. The `node` version of this is really just a proof-of-concept. I plan on making an actual executable in either C#, or Rust (which would be my first time using Rust, so it'll be a nice learning experience)

If you want to run the node version:

1. git clone this repo
2. navigate to `node`, run `pnpm install`
3. copy `config.example.json` to config.json and fill out the neccessary stuffs
4. `pnpm dev`