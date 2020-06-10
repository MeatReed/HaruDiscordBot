const BaseCommand = require('../../utils/structures/BaseCommand')

module.exports = class JoinmessageCommand extends BaseCommand {
  constructor() {
    super({
      name: 'join_message',
      description: '',
      category: 'Administration',
      usage: 'join_message [on/off] | [message]',
      enabled: true,
      guildOnly: true,
      nsfw: false,
      aliases: [],
      userPermissions: [],
      clientPermissions: [],
    })
  }

  async run(client, message, args) {
    const guildConfig = await client.getGuild(message.guild.id)
    const option = args[0]
    if (!guildConfig.channel) {
      message.channel.send({
        embed: {
          color: 0xb1072e,
          description:
            "Vous n'avez pas mis le salon pour le message de Bienvenue et d'Adieu.\nPour mettre un salon faites, faites `h!setchannel {salon}`",
        },
      })
    } else if (!args[0]) {
      if (guildConfig.join === 'off') {
        client.ErrorEmbed(
          message,
          "Le message de bienvenue est désactivé sur ce serveur, faites la commande `h!join_message on` pour l'activer."
        )
        return
      } else {
        message.channel.send({
          embed: {
            color: 0xb1072e,
            description:
              'Le message de Bienvenue de ce serveur est : **' +
              guildConfig.join_message +
              '**\nPour le changer, faites `' +
              guildConfig.prefix +
              'join_message [message]`\nPour remettre le message par défaut, faites `' +
              guildConfig.prefix +
              'join_message reset`\nPour le désactiver, faites `' +
              guildConfig.prefix +
              'join_message off`',
          },
        })
        return
      }
    } else if (option === 'off') {
      if (guildConfig.join === 'off') {
        client.ErrorEmbed(
          message,
          "Le message de bienvenue déjà désactivé sur ce serveur, faites la commande `h!join_message on` pour l'activer."
        )
        return
      }
      client.updateGuild(message.guild.id, {
        join: 'off',
      })
      client.SuccesEmbed(
        message,
        'Le message de Bienvenue de ce serveur a été désactivé !'
      )
    } else if (option === 'on') {
      if (guildConfig.join === 'on') {
        client.ErrorEmbed(
          message,
          'Le message de bienvenue déjà activé sur ce serveur, faites la commande `h!join_message off` pour le désactiver'
        )
        return
      }
      client.updateGuild(message.guild.id, {
        join: 'on',
      })
      client.SuccesEmbed(
        message,
        'Le message de Bienvenue de ce serveur a été activé !'
      )
    } else if (option === 'reset') {
      if (guildConfig.join === 'off') {
        client.ErrorEmbed(
          message,
          "Le message de bienvenue est désactivé sur ce serveur, faites la commande `h!join_message on` pour l'activer."
        )
        return
      }
      client.updateGuild(message.guild.id, {
        join_message: 'Bienvenue {user} dans le serveur {server} !',
      })
      client.SuccesEmbed(
        message,
        'Le message de Bienvenue de ce serveur a été réinitialisé !'
      )
    } else {
      if (guildConfig.join === 'off') {
        client.ErrorEmbed(
          message,
          "Le message de bienvenue est désactivé sur ce serveur, faites la commande `h!join_message on` pour l'activer."
        )
        return
      }
      client.updateGuild(message.guild.id, {
        join_message: args.join(' '),
      })
      message.channel.send({
        embed: {
          title: 'Message de Bienvenue modifié!',
          color: 65349,
          description: `Le message de Bienvenue est maintenant \`${args.join(
            ' '
          )}\``,
        },
      })
    }
  }
}
