# world-boss-helper
A `tera-proxy` module that aims to help with searching for and keeping track of World Bosses.

## Features
- Notifies you in the middle of the screen, if a World Boss is found / is dead / moves out of range
- Spawns a Vergos' Head under the boss for more visibility
- Uploads kill times to a spreadsheet, that is publicly available [HERE](https://tera.zone/worldboss/eu/)
- Supports Caali's auto update

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
### 2018-09-17
- Updated to Caali's new features and latest defs
- Updated the server side stuff and added new regions to the spreadsheet: KR, JP, RU
- Removed discord notification feature, will be replaced with something else soon
### 2018-06-01
- Updated to `dispatch.send()`
- Fixed incompatibility with `no-more-death-animations`
### 2018-05-28
- Character names will only be uploaded, if Discord notifications are enabled
- Removed warn list (this was a useful feature back when everyone was hunting/stealing bosses, but probably not needed anymore)

## Credits
- This module was originally based on an earlier version of [WarnMe](https://github.com/SerenTera/WarnMe) by [SerenTera](https://github.com/SerenTera)
