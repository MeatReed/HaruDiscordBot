const BaseCommand = require('../../utils/structures/BaseCommand')

module.exports = class LeavemessageCommand extends BaseCommand {
  constructor() {
    super({
      name: 'leave_message',
      description: '',
      category: 'Administration',
      usage: 'leave_message [on/off] | [message]',
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
      if (guildConfig.leave === 'off') {
        client.ErrorEmbed(
          message,
          "Le message de leave est désactivé sur ce serveur, faites la commande `h!leave_message on` pour l'activer."
        )
        return
      } else {
        message.channel.send({
          embed: {
            color: 0xb1072e,
            description:
              "Le message d'Adieu de ce serveur est : **" +
              guildConfig.leave_message +
              '**\nPour le changer, faites `' +
              guildConfig.prefix +
              'leave_message [message]`\nPour remettre le message par défaut, faites `' +
              guildConfig.prefix +
              'leave_message reset`\nPour le désactiver, faites `' +
              guildConfig.prefix +
              'leave_message off`',
          },
        })
        return
      }
    } else if (option === 'off') {
      if (guildConfig.leave === 'off') {
        client.ErrorEmbed(
          message,
          "Le message d'Adieu déjà désactivé sur ce serveur, faites la commande `h!leave_message on` pour l'activer."
        )
        return
      }
      client.updateGuild(message.guild.id, {
        leave: 'off',
      })
      client.SuccesEmbed(
        message,
        "Le message d'Adieu de ce serveur a été désactivé !"
      )
    } else if (option === 'on') {
      if (guildConfig.leave === 'on') {
        client.ErrorEmbed(
          message,
          'Le message de bienvenue déjà activé sur ce serveur, faites la commande `h!leave_message off` pour le désactiver'
        )
        return
      }
      client.updateGuild(message.guild.id, {
        leave: 'on',
      })
      client.SuccesEmbed(
        message,
        "Le message d'Adieu de ce serveur a été activé !"
      )
    } else if (option === 'reset') {
      if (guildConfig.leave === 'off') {
        client.ErrorEmbed(
          message,
          "Le message d'Adieu est désactivé sur ce serveur, faites la commande `h!leave_message on` pour l'activer."
        )
        return
      }
      client.updateGuild(message.guild.id, {
        leave_message: '{user} a quitté le serveur.',
      })
      client.SuccesEmbed(
        message,
        "Le message d'Adieu de ce serveur a été réinitialisé !"
      )
    } else {
      if (guildConfig.leave === 'off') {
        client.ErrorEmbed(
          message,
          "Le message d'Adieu est désactivé sur ce serveur, faites la commande `h!leave_message on` pour l'activer."
        )
        return
      }
      client.updateGuild(message.guild.id, {
        leave_message: args.join(' '),
      })
      message.channel.send({
        embed: {
          title: "Message d'Adieu modifié!",
          color: 65349,
          description: `Le message d'Adieu est maintenant \`${args.join(
            ' '
          )}\``,
        },
      })
    }
  }
}
