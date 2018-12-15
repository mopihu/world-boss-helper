const Vec3 = require('tera-vec3');
const request = require('request');
const bosses = require('./bosses.json');

module.exports = function WorldBossHelper(mod) {
  let bossName;
  let currentChannel;
  let mobIds = [];

  mod.command.add('wbh', {
    $default() {
      mod.command.message('World Boss Helper module. Usage:');
      mod.command.message('  /8 wbh - Turn module on/off');
      mod.command.message('  /8 wbh alert - Turn popup alerts on/off');
      mod.command.message('  /8 wbh msg - Turn system messages on/off');
      mod.command.message('  /8 wbh mark - Turn boss markers on/off');
      mod.command.message('  /8 wbh clear - Attempt to clear markers');
      mod.command.message('  /8 wbh ui - Open ingame WB Timers UI');
    },
    alert() {
      mod.settings.alerted = !mod.settings.alerted;
      mod.command.message(mod.settings.alerted ? 'System popup notice: enabled.' : 'System popup notice: disabled.');
    },
    msg() {
      mod.settings.messager = !mod.settings.messager;
      mod.command.message(mod.settings.messager ? 'System message: enabled.' : 'System message: disabled.');
    },
    mark() {
      mod.settings.marker = !mod.settings.marker;
      mod.command.message(mod.settings.marker ? 'Markers: enabled.' : 'Markers: disabled.');
    },
    clear() {
      mod.command.message('Markers cleared.');
      for (let id of mobIds) {
        despawnItem(id);
      }
    },
    ui() {
      mod.send('S_OPEN_AWESOMIUM_WEB_URL', 1, {
        url: 'tera.zone/worldboss/ingame.php?serverId=' + mod.game.me.serverId
      });
    },
    $none() {
      mod.settings.enabled = !mod.settings.enabled;
      mod.command.message(mod.settings.enabled ? 'Module: enabled.' : 'Module: disabled.');
      if (!mod.settings.enabled) {
        for (let id of mobIds) {
          despawnItem(id);
        }
      }
    }
  })

  mod.game.me.on('change_zone', () => {
    mobIds = [];
  })

  mod.hook('S_CURRENT_CHANNEL', 2, event => {
    currentChannel = event.channel;
  })

  mod.hook('S_SPAWN_NPC', 10, event => {
    if (!mod.settings.enabled) return;
    let boss;
    if (boss = bosses.filter(b => b.huntingZoneId.includes(event.huntingZoneId) && b.templateId === event.templateId)[0]) {
      bossName = boss.name;
      if (mod.settings.marker) {
        spawnItem(event.loc, event.gameId);
        mobIds.push(event.gameId);
      }
      if (mod.settings.alerted) {
        notice('Found boss: ' + bossName + '!');
      }
      if (mod.settings.messager) {
        mod.command.message('Found boss: ' + bossName + '!');
      }
    }
  })

  mod.hook('S_DESPAWN_NPC', 3, {order: -100}, event => {
    if (!mod.settings.enabled) return;
    if (mobIds.includes(event.gameId)) {
      if (mod.settings.alerted && bossName) {
        if (event.type == 5) {
          request.post('https://tera.zone/worldboss/upload.php', {
            form: {
              region: mod.region,
              serverId: mod.game.me.serverId,
              boss: bossName,
              channel: currentChannel,
            }
          }, function(err, httpResponse, body) {
            if (err) {
              console.error(err);
            } else {
              console.log('[world-boss] ' + body);
            }
          });
          if (mod.settings.alerted) {
            notice(bossName + ' is dead!');
          }
          if (mod.settings.messager) {
            mod.command.message('' + bossName + ' is dead!');
          }
        } else if (event.type == 1) {
          if (mod.settings.alerted) {
            notice(bossName + ' is out of range...');
          }
          if (mod.settings.messager) {
            mod.command.message('' + bossName + ' is out of range...');
          }
        }
      }
      bossName = null;
      despawnItem(event.gameId);
      mobIds.splice(mobIds.indexOf(event.gameId), 1);
    }
  })

  function spawnItem(loc, gameId) {
    mod.send('S_SPAWN_DROPITEM', 6, {
      gameId: gameId*100n,
      loc: loc,
      item: mod.settings.itemId,
      amount: 1,
      expiry: 600000,
      owners: [{
        id: 0
      }]
    });
  }

  function despawnItem(gameId) {
    mod.send('S_DESPAWN_DROPITEM', 4, {
      gameId: gameId*100n,
    });
  }

  function notice(msg) {
    mod.send('S_DUNGEON_EVENT_MESSAGE', 2, {
      type: 42,
      chat: 0,
      channel: 0,
      message: msg
    });
  }

  this.destructor = function() {
    mod.command.remove('wbh');
  }
}
