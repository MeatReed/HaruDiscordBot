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
      message.channel.send('Aucun utilisateur spécifié.')
      return
    }
    const user = client.fetchUser(args[0], message)
    let reason = args.slice(1).join(' ')
    if (!user) {
      message.channel.send('Utilisateur introuvable !')
      return
    } else if (message.author.id === user.id) {
      message.reply('Vous ne pouvez pas vous expulser !')
      return
    }
    if (!reason) {
      reason = 'Aucune raison spécifié.'
    }
    message.guild.members.cache
      .get(user.id)
      .kick({ reason })
      .then((usr) => {
        message.channel.send(
          `L'utilisateur <@${user.id}> a été expulsé. Raison : ${reason}`
        )
      })
      .catch((error) => {
        message.reply('impossible de expulser cet utilisateur !')
      })
  }
}
