const BaseCommand = require('../../utils/structures/BaseCommand')

module.exports = class UnmuteCommand extends BaseCommand {
  constructor() {
    super({
      name: 'unmute',
      description: '',
      category: 'Modération',
      usage: 'unmute [utilisateur]',
      enabled: true,
      guildOnly: true,
      nsfw: false,
      aliases: [],
      userPermissions: ['KICK_MEMBERS', 'MANAGE_ROLES'],
      clientPermissions: ['KICK_MEMBERS', 'MANAGE_ROLES'],
    })
  }

  async run(client, message, args) {
    if (!args.join(' ')) {
      client.ErrorEmbed(message, 'Aucun utilisateur spécifié.')
      return
    }
    const user = client.fetchUser(args.join(' '), message)
    if (!user) {
      client.ErrorEmbed(message, 'Utilisateur introuvable !')
      return
    } else if (message.author.id === user.id) {
      client.ErrorEmbed(message, 'Vous ne pouvez pas vous réduire au silence !')
      return
    }
    const member = message.guild.members.cache.get(user.id)
    let muteRole = message.guild.roles.cache.find((r) => r.name === 'muted')
    if (!muteRole) {
      muteRole = await message.guild.roles.create({
        data: {
          name: 'muted',
          color: '#000',
          permissions: [],
        },
      })
      message.guild.channels.cache.forEach(async (channel) => {
        await channel.updateOverwrite(muteRole, {
          SEND_MESSAGES: false,
          ADD_REACTIONS: false,
          CONNECT: false,
        })
      })
    }
    if (!member.roles.cache.find((r) => r.name === 'muted')) {
      client.ErrorEmbed(message, `<@${user.id}> n'est pas mute !`)
      return
    }
    await member.roles
      .remove(muteRole.id)
      .then((usr) => {
        client.SuccesEmbed(
          message,
          `L'utilisateur ${usr} n'est plus réduit au silence.`
        )
      })
      .catch((error) => {
        client.ErrorEmbed(
          message,
          `Impossible d'enlever le rôle \`muted\` à <@${user.id}>`
        )
      })
  }
}
