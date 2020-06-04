const BaseCommand = require('../../utils/structures/BaseCommand')

module.exports = class BanCommand extends BaseCommand {
  constructor() {
    super({
      name: 'ban',
      description: '',
      category: 'Modération',
      usage: '',
      enabled: true,
      guildOnly: true,
      nsfw: false,
      aliases: [],
      userPermissions: [],
      clientPermissions: []
    })
  }

  async run(client, message, args) {
    const user = client.fetchUser(args.join(' '), message)
    console.log(user)
  }
}