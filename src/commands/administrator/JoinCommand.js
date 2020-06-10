const BaseCommand = require('../../utils/structures/BaseCommand')

module.exports = class JoinCommand extends BaseCommand {
  constructor() {
    super({
      name: 'join',
      description: '',
      category: 'Administration',
      usage: 'join',
      enabled: true,
      guildOnly: true,
      nsfw: false,
      aliases: [],
      userPermissions: [],
      clientPermissions: [],
    })
  }

  async run(client, message, args) {
    client.emit('guildMemberAdd', message.member)
  }
}
