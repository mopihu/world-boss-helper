# world-boss-helper
A tera-proxy module to notify you if a World Boss is near you. It uses a dungeon event message style notice, and spawns a Vergos' Head under the boss for more visibility. It also uploads kill times to my server, and it can send notifications to Discord via webhook. Supports Caali's auto-update feature.

## Dependency
- `Command` module

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

## Credits
- Contains code from: [WarnMe](https://github.com/SerenTera/WarnMe) by [SerenTera](https://github.com/SerenTera)
