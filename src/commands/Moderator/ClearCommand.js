const BaseCommand = require('../../utils/structures/BaseCommand')

module.exports = class ClearCommand extends BaseCommand {
  constructor() {
    super({
      name: 'clear',
      description: '',
      category: 'Modération',
      usage: 'clear [nombre]',
      enabled: true,
      guildOnly: true,
      nsfw: false,
      aliases: [],
      userPermissions: ['MANAGE_MESSAGES'],
      clientPermissions: ['MANAGE_MESSAGES'],
    })
  }

  run(client, message, args) {
    if (!args[0]) {
      client.ErrorEmbed(message, 'Aucun nombre spécifié.')
      return
    }
    const amount = parseInt(args[0])
    if (amount <= 0) {
      client.ErrorEmbed(
        message,
        'Votre nombre ne peut pas être égal ou inférieur à 0'
      )
      return
    }
    message.channel
      .bulkDelete(amount)
      .then((messages) => {
        client.SuccesEmbed(message, `\`${messages.size}\` messages supprimé.`)
      })
      .catch((error) => {
        client.ErrorEmbed(
          message,
          'Une erreur est survenue : \n```JS\n' + error.message + '```'
        )
      })
    message.delete()
  }
}
