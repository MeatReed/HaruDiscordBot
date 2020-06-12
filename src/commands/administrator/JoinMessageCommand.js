const BaseCommand = require('../../utils/structures/BaseCommand')

module.exports = class JoinMessageCommand extends BaseCommand {
  constructor() {
    super({
      name: 'join_message',
      description: 'Permet de configurer le message de bienvenue',
      category: 'Administration',
      usage: 'join_message [on/off] | [message] | [reset]',
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
    const option = args[0]
    if (!guildConfig.join_channel) {
      message.channel.send({
        embed: {
          color: 0xb1072e,
          description:
            "Vous n'avez pas mis le salon pour le message/image de Bienvenue.\nPour mettre un salon faites, faites `h!join_channel {salon}`",
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
        const ownerUser = client.getOwner()
        message.channel.send({
          embed: {
            title: 'Message de bienvenue',
            description:
              'Le message de bienvenue actuel de votre serveur est **' +
              guildConfig.join_message +
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
                name: 'h!join_message [on/off]',
                value:
                  "**Description:** Permet d'activer ou de désactiver le message de bienvenue.\n**Exemple:** `h!join_message on`",
              },
              {
                name: 'h!join_message reset',
                value:
                  '**Description:** Permet de mettre les paramètres par défaut(message).\n**Exemple:** `h!join_message reset`',
              },
              {
                name: 'h!join_message [message]',
                value:
                  "**Description:** Permet de changer le message de bienvenue.\n**Exemple:** `h!join_message Bienvenue {user} sur le serveur {server} !`\n\n{user} = mention\n{username} = pseudo de l'utilisateur\n{server} = nom du serveur",
              },
            ],
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
