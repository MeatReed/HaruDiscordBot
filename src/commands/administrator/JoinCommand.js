const BaseCommand = require('../../utils/structures/BaseCommand')

module.exports = class JoinCommand extends BaseCommand {
  constructor() {
    super({
      name: 'join',
      description: 'Simule un utilisateur qui rejoint le serveur.',
      category: 'Administration',
      usage: 'join',
      enabled: true,
      guildOnly: true,
      nsfw: false,
      aliases: [],
      userPermissions: ['ADMINISTRATOR'],
      clientPermissions: [],
    })
  }

  async run(client, message, args) {
    client.emit('guildMemberAdd', message.member)
  }
}
