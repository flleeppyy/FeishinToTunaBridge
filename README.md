# FeishinToTunaBridge

This is a Feishin to Tuna bridge. Tuna is an [OBS Plugin](https://obsproject.com/forum/resources/tuna.843/) that "​Lets you display information about the currently playing song in obs without running a separate program". [Feishin](https://github.com/jeffvli/feishin) is a music player for self-hosted instances such as Jellyfin

This bridge makes use of the remote control server built into Feishin that lets you request currently playing data, as well as control the client. We take this data, and send it to the webserver port that Tuna opens, which is normally used by the [web browser script](https://github.com/univrsal/tuna/raw/master/deps/tuna_browser.user.js) that you use with Tuna.

