require('dotenv').config()
const { Client } = require('discord.js')
const { registerCommands, registerEvents } = require('./utils/registry')
const client = new Client()
const { Manager } = require('@lavacord/discord.js')

const queueFile = require('./queue')

const nodes = [
  {
    id: '1',
    host: process.env.LAVACORD_HOST,
    port: process.env.LAVACORD_PORT,
    password: process.env.LAVACORD_PASSWORD,
  },
]

;(async () => {
  setTimeout(() => {
    client.manager = new Manager(client, nodes, {
      user: process.env.DISCORD_BOT_ID,
      shards: 1,
    })
    client.manager.connect().then(() => console.log('Lavalink Connected'))
    client.manager.on('error', (error, node) => {
      error
      node
    })
  }, 30000)
  client.music = require('./utils/player')
  require('./utils/warnFunctions')(client)
  require('./utils/functions')(client)
  require('./utils/messages')(client)
  require('./utils/api')(client)
  client.mysql = require('./utils/mysql').init()
  client.ameApi = require('./utils/amethysteApi').init()
  client.queue = queueFile
  client.commands = new Map()
  client.aliases = new Map()
  client.events = new Map()
  client.prefix = process.env.DISCORD_BOT_PREFIX
  await registerCommands(client, '../commands')
  await registerEvents(client, '../events')
  await client.login(process.env.DISCORD_BOT_TOKEN)
})()
