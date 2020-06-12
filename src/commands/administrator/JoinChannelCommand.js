const BaseCommand = require('../../utils/structures/BaseCommand')

module.exports = class JoinChannelCommand extends BaseCommand {
  constructor() {
    super({
      name: 'join_channel',
      description:
        'Permet de configurer le salon pour le message/image de Bienvenue.',
      category: 'Administration',
      usage: 'join_channel {salon}',
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
      if (guildConfig.join_channel === null) {
        message.channel.send({
          embed: {
            color: 0xb1072e,
            description:
              "Il n'y a pas de salon pour le message/image de Bienvenue.\nPour mettre le salon, faites `" +
              guildConfig.prefix +
              'join_channel {salon}`',
          },
        })
        return
      }
      const dbChannel = message.guild.channels.cache.get(
        guildConfig.join_channel
      )
      message.channel.send({
        embed: {
          color: 0xb1072e,
          description:
            'Le salon pour le message/image de Bienvenue est : **#' +
            dbChannel.join_channel +
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
        join_channel: null,
      })
      client.SuccesEmbed(
        message,
        "Le salon pour le message de Bienvenue et d'Adieu a été enlevé avec succès !"
      )
      return
    }

    const channel = client.fetchChannel(args.join(' '), message)

    if (!channel) {
      client.ErrorEmbed(message, 'Salon introuvable.')
      return
    }

    client.updateGuild(message.guild.id, {
      join_channel: channel.id,
    })

    message.channel.send({
      embed: {
        title: 'Channel modifié!',
        color: 65349,
        description: `Le salon pour le message/image de Bienvenue est maintenant ${channel}`,
      },
    })
  }
}
