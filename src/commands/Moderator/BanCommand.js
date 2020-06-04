const BaseCommand = require('../../utils/structures/BaseCommand')

module.exports = class BanCommand extends BaseCommand {
  constructor() {
    super({
      name: 'ban',
      description: '',
      category: 'Modération',
      usage: 'ban [utilisateur] {raison}',
      enabled: true,
      guildOnly: true,
      nsfw: false,
      aliases: [],
      userPermissions: ['BAN_MEMBERS'],
      clientPermissions: ['BAN_MEMBERS'],
    })
  }

  run(client, message, args) {
    if (!args[0]) {
      client.ErrorEmbed(message, 'Aucun utilisateur spécifié.')
      return
    }
    const user = client.fetchUser(args[0], message)
    let reason = args.slice(1).join(' ')
    if (!user) {
      client.ErrorEmbed(message, 'Utilisateur introuvable !')
      return
    } else if (message.author.id === user.id) {
      client.ErrorEmbed(message, 'Vous ne pouvez pas vous bannir !')
      return
    }
    if (!reason) {
      reason = 'Aucune raison spécifié.'
    }
    message.guild.members
      .ban(user.id, { reason })
      .then((usr) => {
        client.SuccesEmbed(
          message,
          `L'utilisateur <@${user.id}> a été banni. Raison : ${reason}`
        )
      })
      .catch((error) => {
        client.ErrorEmbed(message, 'Impossible de bannir cet utilisateur !')
      })
  }
}
