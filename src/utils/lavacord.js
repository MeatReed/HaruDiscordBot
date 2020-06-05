require('dotenv').config()
const { Manager } = require('lavacord')

// lavacord config
const nodes = [
  {
    id: '1',
    host: process.env.LAVACORD_HOST,
    port: process.env.LAVACORD_PORT,
    password: process.env.LAVACORD_PASSWORD,
  },
]

module.exports = {
  init: async () => {
    const manager = new Manager(nodes, {
      user: process.env.DISCORD_BOT_ID,
      shards: 1,
      send: (packet) => {},
    })
    await manager.connect()
    manager.on('error', (error, node) => {
      error
      node
    })
    return manager
  },
}
