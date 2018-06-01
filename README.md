# world-boss-helper
A `tera-proxy` module that aims to help with searching for and keeping track of World Bosses.

## Features
- Notifies you in the middle of the screen, if a World Boss is found / is dead / moves out of range
- Spawns a Vergos' Head under the boss for more visibility
- Uploads kill times to a spreadsheet, that is publicly available [HERE](https://tera.zone/worldboss/eu/)
- It can send notifications to a Discord webhook, so that your friends/guild mates can instantly know you found a boss
- Supports Caali's auto update

## Dependencies
- `command`
- `tera-vec3`
- `request`

If you use Pinkie's proxy, then you need to run `npm install request` in the main proxy directory. If you use Caali's proxy, then you're good to go, because `request` is already bundled in it.

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
### `wbh ui`
- Shows timers via in game browser

## Changelog
### 2018-06-01
- Updated to `dispatch.send()`
- Fixed incompatibility with `no-more-death-animations`
### 2018-05-28
- Character names will only be uploaded, if Discord notifications are enabled
- Removed warn list (this was a useful feature back when everyone was hunting/stealing bosses, but probably not needed anymore)

## Credits
- This module was originally based on an earlier version of [WarnMe](https://github.com/SerenTera/WarnMe) by [SerenTera](https://github.com/SerenTera)
