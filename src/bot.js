require('dotenv').config()
const { Client } = require('discord.js')
const { registerCommands, registerEvents } = require('./utils/registry')
const client = new Client()

;(async () => {
  require('./utils/functions')(client)
  require('./utils/messages')(client)
  client.mysql = require('./utils/mysql').init()
  client.commands = new Map()
  client.events = new Map()
  client.prefix = process.env.DISCORD_BOT_PREFIX
  await registerCommands(client, '../commands')
  await registerEvents(client, '../events')
  await client.login(process.env.DISCORD_BOT_TOKEN)
})()
