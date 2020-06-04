const BaseCommand = require('../../utils/structures/BaseCommand')

module.exports = class KickCommand extends BaseCommand {
  constructor() {
    super({
      name: 'kick',
      description: '',
      category: 'Modération',
      usage: 'kick [utilisateur] {raison}',
      enabled: true,
      guildOnly: true,
      nsfw: false,
      aliases: [],
      userPermissions: ['KICK_MEMBERS'],
      clientPermissions: ['KICK_MEMBERS'],
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
      client.ErrorEmbed(message, 'Vous ne pouvez pas vous expulser !')
      return
    }
    if (!reason) {
      reason = 'Aucune raison spécifié.'
    }
    message.guild.members.cache
      .get(user.id)
      .kick({ reason })
      .then((usr) => {
        client.SuccesEmbed(
          message,
          `L'utilisateur <@${user.id}> a été expulsé. Raison : ${reason}`
        )
      })
      .catch((error) => {
        client.ErrorEmbed(message, 'Impossible de expulser cet utilisateur !')
      })
  }
}
