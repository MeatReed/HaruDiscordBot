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
      userPermissions: ['ADMINISTRATOR'],
      clientPermissions: [],
    })
  }

  run(client, message, args) {
    const msg = args.join(' ')
    if (!msg) {
      client.ErrorEmbed(
        message,
        "Vous avez oublié d'insérer le message que vous voulez envoyer avec Haru !"
      )
      return
    }
    message.channel.send(msg)
    message.delete()
  }
}
