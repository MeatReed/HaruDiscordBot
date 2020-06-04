const BaseCommand = require('../../utils/structures/BaseCommand')

module.exports = class TestCommand extends BaseCommand {
  constructor() {
    super({
      name: 'test',
      description: 'test command',
      category: 'dev',
      usage: 'test',
      enabled: true,
      guildOnly: false,
      nsfw: false,
      aliases: ['t']
    })
  }

  async run(client, message, args) {
    message.channel.send('Test command works')
  }
}
