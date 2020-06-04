const BaseCommand = require('../../utils/structures/BaseCommand')

module.exports = class SayCommand extends BaseCommand {
  constructor() {
    super({
      name: 'say',
      description: '',
      category: 'Administration',
      usage: 'say [message]',
      enabled: true,
      guildOnly: true,
      nsfw: false,
      aliases: [],
      userPermissions: ['MANAGE_CHANNELS'],
      clientPermissions: [],
    })
  }

  run(client, message, args) {
    const msg = args.join(' ')
    if (!msg) {
      message.reply(
        "vous avez oublié d'insérer le message que vous voulez envoyer avec Haru !"
      )
      return
    }
    message.channel.send(msg)
    message.delete()
  }
}
