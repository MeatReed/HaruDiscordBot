const BaseCommand = require('../../utils/structures/BaseCommand')

module.exports = class LeaveCommand extends BaseCommand {
  constructor() {
    super({
      name: 'leave',
      description: '',
      category: 'Administration',
      usage: 'leave',
      enabled: true,
      guildOnly: true,
      nsfw: false,
      aliases: [],
      userPermissions: [],
      clientPermissions: [],
    })
  }

  async run(client, message, args) {
    client.emit('guildMemberRemove', message.member)
  }
}
