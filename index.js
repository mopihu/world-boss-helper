const config = require("./config.json")
const bosses = require("./bosses.json")
const request = require('request')
const itemId = 98260

let enabled = config.enabled
let alerted = config.alerted
let messager = config.messager
let marker = config.marker
let discord = config.discordWebhookUrl
let mention = config.mention

const Command = require('command')

module.exports = function wbhunter(dispatch) {
  const command = Command(dispatch)

  let bossName
  let mobid = []

  command.add('wbh', (arg) => {
    switch (arg) {
      case 'alert':
        alerted = !alerted
        command.message(alerted ? ' (World-Boss) System popup notice enabled.' : ' (World-Boss) System popup notice disabled.')
        break

      case 'msg':
        messager = !messager
        command.message(messager ? ' (World-Boss) System message enabled.' : ' (World-Boss) System message disabled.')
        break

      case 'mark':
        marker = !marker
        command.message(marker ? ' (World-Boss) Markers enabled.' : ' (World-Boss) Markers disabled.')
        break

      case 'clear':
        command.message(' (World-Boss) Markers cleared.')
        for (let itemId of mobid) despawnthis(itemId)
        break

      default:
        enabled = !enabled
        command.message(enabled ? ' (World-Boss) Module enabled.' : ' (World-Boss) Module disabled.')
        if (!enabled)
          for (let itemId of mobid) despawnthis(itemId)
    }
  })

  dispatch.hook('S_LOGIN', 9, event => {
    serverId = event.serverId
    playerName = event.name
  })

  dispatch.hook('S_LOAD_TOPO', 2, event => {
    mobid = []
  })

  dispatch.hook('S_CURRENT_CHANNEL', 2, event => {
    currentChannel = event.channel
  })

  dispatch.hook('S_SPAWN_NPC', 5, event => {
    let boss
    if (enabled && (boss = bosses.filter(b => b.huntingZoneId.includes(event.huntingZoneId) && b.templateId === event.templateId)[0])) {
      bossName = boss.name
      if (marker) {
        markthis(event.x, event.y, event.z, event.gameId.low),
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

      if (alerted)
        notice('Found boss: ' + bossName + '!')

      if (messager)
        command.message(' (World-Boss) Found boss: ' + bossName + '!')
    }
  })

  dispatch.hook('S_DESPAWN_NPC', 2, event => {
    if (mobid.includes(event.gameId.low)) {
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
        if (alerted && bossName) {
          notice(bossName + ' is dead!')
        }
      } else if (event.type == 1) {
        if (alerted && bossName) {
          notice(bossName + ' is out of range...')
        }
      }

      bossName = null
      despawnthis(event.gameId.low),
        mobid.splice(mobid.indexOf(event.gameId.low), 1)
    }
  })

  function markthis(locationx, locationy, locationz, idRef) {
    dispatch.toClient('S_SPAWN_DROPITEM', 5, {
      id: {
        low: idRef,
        high: 0,
        unsigned: true
      },
      x: locationx,
      y: locationy,
      z: locationz,
      item: itemId,
      amount: 1,
      expiry: 600000,
      owners: [{
        id: 0
      }]
    })
  }

  function despawnthis(despawnid) {
    dispatch.toClient('S_DESPAWN_DROPITEM', 3, {
      id: {
        low: despawnid,
        high: 0,
        unsigned: true
      }
    })
  }

  function notice(msg) {
    dispatch.toClient('S_DUNGEON_EVENT_MESSAGE', 1, {
      unk1: 42,
      unk2: 0,
      unk3: 27,
      message: msg
    })
  }
}
