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
      aliases: ['t'],
      userPermissions: ['BAN_MEMBERS'],
      clientPermissions: ['BAN_MEMBERS'],
    })
  }

  run(client, message, args) {
    message.channel.send('Test command works')
  }
}
