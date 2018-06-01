const Command = require('command')
const Vec3 = require('tera-vec3')
const request = require('request')
const config = require('./config.json')
const bosses = require('./bosses.json')
const itemId = 98260

let enabled = config.enabled
let alerted = config.alerted
let messager = config.messager
let marker = config.marker
let discord = config.discordWebhookUrl
let mention = config.mention

module.exports = function WorldBossHelper(dispatch) {
  const command = Command(dispatch)

  let playerName
  let currentZone
  let bossName
  let mobid = []

  command.add('wbh', (arg1, arg2) => {
    switch (arg1) {
      case 'alert':
        alerted = !alerted
        command.message(alerted ? ' (World-Boss) System popup notice: [' + green('ON') + '].' : ' (World-Boss) System popup notice: [' + red('OFF') + '].')
        break

      case 'msg':
        messager = !messager
        command.message(messager ? ' (World-Boss) System message: [' + green('ON') + '].' : ' (World-Boss) System message: [' + red('OFF') + '].')
        break

      case 'mark':
        marker = !marker
        command.message(marker ? ' (World-Boss) Markers: [' + green('ON') + '].' : ' (World-Boss) Markers: [' + red('OFF') + '].')
        break

      case 'clear':
        command.message(' (World-Boss) Markers cleared.')
        for (let itemId of mobid) {
          despawnItem(itemId)
        }
        break

      case 'ui':
        dispatch.send('S_OPEN_AWESOMIUM_WEB_URL', 1, {
          url: 'tera.zone/worldboss/ingame.php?serverId=' + serverId
        })
        break

      default:
        enabled = !enabled
        command.message(enabled ? ' (World-Boss) Module: [' + green('ON') + '].' : ' (World-Boss) Module: [' + red('OFF') + '].')
        if (!enabled) {
          for (let itemId of mobid) {
            despawnItem(itemId)
          }
        }
    }
  })

  dispatch.hook('S_LOGIN', 10, (event) => {
    serverId = event.serverId
    if (discord) {
      playerName = event.name
    } else {
      playerName = "Anonymous"
    }
  })

  dispatch.hook('S_LOAD_TOPO', 3, (event) => {
    currentZone = event.zone
    mobid = []
  })

  dispatch.hook('S_CURRENT_CHANNEL', 2, (event) => {
    currentChannel = event.channel
  })

  dispatch.hook('S_SPAWN_NPC', 8, (event) => {
    let boss
    if (enabled && (boss = bosses.filter(b => b.huntingZoneId.includes(event.huntingZoneId) && b.templateId === event.templateId)[0])) {
      bossName = boss.name
      if (marker) {
        spawnItem(event.loc, event.gameId.low)
        mobid.push(event.gameId.low)
      }
      request.post('https://tera.zone/worldboss/upload.php', {
        form: {
          serverId: serverId,
          playerName: playerName,
          bossName: bossName,
          channel: currentChannel,
          time: new Date().getTime(),
          status: 'found',
          discord: encodeURIComponent(discord),
          mention: mention
        }
      }, function(err, httpResponse, body) {
        if (err) {
          console.log(err)
        } else {
          console.log('[world-boss] ' + body)
        }
      })
      if (alerted) {
        notice('Found boss: ' + bossName + '!')
      }
      if (messager) {
        command.message(' (World-Boss) Found boss: ' + bossName + '!')
      }
    }
  })

  dispatch.hook('S_DESPAWN_NPC', 3, {order: -100}, (event) => {
    if (mobid.includes(event.gameId.low)) {
      if (alerted && bossName) {
        if (event.type == 5) {
          request.post('https://tera.zone/worldboss/upload.php', {
            form: {
              serverId: serverId,
              playerName: playerName,
              bossName: bossName,
              channel: currentChannel,
              time: new Date().getTime(),
              status: 'killed',
              discord: encodeURIComponent(discord)
            }
          }, function(err, httpResponse, body) {
            if (err) {
              console.log(err)
            } else {
              console.log('[world-boss] ' + body)
            }
          })
          if (alerted) {
            notice(bossName + ' is dead!')
          }
          if (messager) {
            command.message(' (World-Boss) ' + bossName + ' is dead!')
          }
        } else if (event.type == 1) {
          if (alerted) {
            notice(bossName + ' is out of range...')
          }
          if (messager) {
            command.message(' (World-Boss) ' + bossName + ' is out of range...')
          }
        }
      }
      bossName = null
      despawnItem(event.gameId.low)
      mobid.splice(mobid.indexOf(event.gameId.low), 1)
    }
  })

  function spawnItem(loc, gameId) {
    dispatch.send('S_SPAWN_DROPITEM', 6, {
      gameId: {
        low: gameId,
        high: 0,
        unsigned: true
      },
      loc: loc,
      item: itemId,
      amount: 1,
      expiry: 600000,
      owners: [{
        id: 0
      }]
    })
  }

  function despawnItem(gameId) {
    dispatch.send('S_DESPAWN_DROPITEM', 4, {
      gameId: {
        low: gameId,
        high: 0,
        unsigned: true
      }
    })
  }

  function notice(msg) {
    dispatch.send('S_DUNGEON_EVENT_MESSAGE', 2, {
      type: 42,
      chat: 0,
      channel: 0,
      message: msg
    })
  }

  function green(text) {
    return '<font color="#78DD56">' + text + '</font>'
  }

  function red(text) {
    return '<font color="#FF7F7F">' + text + '</font>'
  }

  this.destructor = function() {
    command.remove('wbh')
  }
}
