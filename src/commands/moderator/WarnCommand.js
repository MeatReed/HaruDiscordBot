const BaseCommand = require('../../utils/structures/BaseCommand')

module.exports = class WarnCommand extends BaseCommand {
  constructor() {
    super({
      name: 'warn',
      description: '',
      category: 'Modération',
      usage: 'warn [utilisateur] {raison}',
      enabled: true,
      guildOnly: true,
      nsfw: false,
      aliases: ['setwarn', 'addwarn'],
      userPermissions: ['BAN_MEMBERS', 'KICK_MEMBERS', 'MANAGE_ROLES'],
      clientPermissions: ['BAN_MEMBERS', 'KICK_MEMBERS', 'MANAGE_ROLES'],
    })
  }

  async run(client, message, args) {
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
      client.ErrorEmbed(message, 'Vous ne pouvez pas vous avertir !')
      return
    } else if (user.bot === true) {
      client.ErrorEmbed(message, 'Vous ne pouvez pas avertir un bot !')
      return
    } else if (!reason) {
      reason = 'Aucune raison spécifié.'
    }
    await client.setWarn(message.guild.id, user.id, message.author.id, reason)
    client.SuccesEmbed(
      message,
      `L'utilisateur <@${user.id}> a été averti. Raison : ${reason}`
    )
  }
}
