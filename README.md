# world-boss-helper
A `tera-proxy` module to notify you if a World Boss is near you. It uses a dungeon event message style notice, and spawns a Vergos' Head under the boss for more visibility. It also uploads kill times to my server, timers can be checked [here](https://tera.zone/worldboss/). I made this for EU originally, but it should also work on NA. It can also send notifications to Discord via webhook. Supports Caali's auto-update feature.

## Dependencies
- `command` module
- `tera-vec3` module

## Config
You can edit `config.json` to change default settings. If you want to notify your friends/guild on Discord, you can create a Webhook, and enter the URL in the config.

## Usage
### `wbh`
- Toggle on/off
- Default is on
### `wbh alert`
- Toggle popup notice on/off
- Default is on
### `wbh msg`
- Toggle system message on/off
- Default is on
### `wbh mark`
- Toggle markers on/off
- Default is on
### `wbh clear`
- Attempts to clear markers
### `wbh addwarn <player>`
- Adds a player to the warn list (Notifies you if a player is nearby while you're killing a boss)
### `wbh removewarn <player>`
- Removes a player from the warn list
### `wbh ui`
- Shows timers via in game browser

## Credits
- Contains code from: [WarnMe](https://github.com/SerenTera/WarnMe) by [SerenTera](https://github.com/SerenTera)
