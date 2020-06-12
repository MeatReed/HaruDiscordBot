const BaseCommand = require('../../utils/structures/BaseCommand')

module.exports = class LeaveChannelCommand extends BaseCommand {
  constructor() {
    super({
      name: 'leave_channel',
      description:
        "Permet de configurer le salon pour le message/image d'Adieu.",
      category: 'Administration',
      usage: 'leave_channel {salon}',
      enabled: true,
      guildOnly: true,
      nsfw: false,
      aliases: [],
      userPermissions: ['ADMINISTRATOR'],
      clientPermissions: [],
    })
  }

  async run(client, message, args) {
    const guildConfig = await client.getGuild(message.guild.id)
    if (!args.join(' ')) {
      if (guildConfig.leave_channel === null) {
        message.channel.send({
          embed: {
            color: 0xb1072e,
            description:
              "Il n'y a pas de salon pour le message/image d'Adieu.\nPour mettre le salon, faites `" +
              guildConfig.prefix +
              'leave_channel {salon}`',
          },
        })
        return
      }
      const dbChannel = message.guild.channels.cache.get(
        guildConfig.leave_channel
      )
      message.channel.send({
        embed: {
          color: 0xb1072e,
          description:
            "Le salon pour le message/image d'Adieu est : **#" +
            dbChannel.leave_channel +
            '**\nPour changer le salon, faites `' +
            guildConfig.prefix +
            'setchannel {salon}`\nPour enlever le salon, faites `' +
            guildConfig.prefix +
            'setchannel remove`',
        },
      })
      return
    }

    if (args.join(' ') === 'remove') {
      client.updateGuild(message.guild.id, {
        leave_channel: null,
      })
      client.SuccesEmbed(
        message,
        "Le salon pour le message d'Adieu et d'Adieu a été enlevé avec succès !"
      )
      return
    }

    const channel = client.fetchChannel(args.join(' '), message)

    if (!channel) {
      client.ErrorEmbed(message, 'Salon introuvable.')
      return
    }

    client.updateGuild(message.guild.id, {
      leave_channel: channel.id,
    })

    message.channel.send({
      embed: {
        title: 'Channel modifié!',
        color: 65349,
        description: `Le salon pour le message d'Adieu est maintenant ${channel}`,
      },
    })
  }
}
