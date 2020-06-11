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
        const ownerUser = client.getOwner()
        message.channel.send({
          embed: {
            title: "Message d 'Adieu",
            description:
              "Message d 'Adieu actuel de votre serveur est **" +
              guildConfig.leave_message +
              "**.\n\nS'il y a un problème, vous pouvez faire la commande " +
              `***${client.prefix}report {raison}***` +
              ' ou envoyez moi un message privé `' +
              ownerUser.tag +
              '`\n------------------------------------------------------------------------------',
            color: 0xb1072e,
            footer: {
              icon_url: message.author.avatarURL(),
              text: 'Demandée par ' + message.author.tag,
            },
            thumbnail: {
              url: client.user.avatarURL(),
            },
            fields: [
              {
                name: 'h!leave_message [on/off]',
                value:
                  "**Description:** Permet d'activer ou de désactiver le message d'Adieu.\n**Exemple:** `h!leave_message on`",
              },
              {
                name: 'h!leave_message reset',
                value:
                  '**Description:** Permet de mettre les paramètres par défaut(message).\n**Exemple:** `h!leave_message reset`',
              },
              {
                name: 'h!leave_message [message]',
                value:
                  "**Description:** Permet de changer le message d'Adieu.\n**Exemple:** `h!leave_message {user} a quitté le serveur.`\n\n{user} = mention\n{username} = pseudo de l'utilisateur\n{server} = nom du serveur",
              },
            ],
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
