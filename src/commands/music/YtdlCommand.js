const BaseCommand = require('../../utils/structures/BaseCommand')

module.exports = class YtdlCommand extends BaseCommand {
  constructor() {
    super({
      name: 'ytdl',
      description: '',
      category: '🎸 Musique',
      usage: 'ytdl',
      enabled: true,
      guildOnly: true,
      nsfw: false,
      aliases: [],
      userPermissions: [],
      clientPermissions: [],
    })
  }

  run(client, message, args) {
    const search = args.join(' ')
    if (!search) return
    client.ytdl.addToQueue(client, message, search)
  }
}
