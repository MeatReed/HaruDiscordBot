const BaseCommand = require('../../utils/structures/BaseCommand')
const isImageUrl = require('is-image-url')

module.exports = class JoinimageCommand extends BaseCommand {
  constructor() {
    super({
      name: 'join_image',
      description: '',
      category: 'Administration',
      usage: 'join_image',
      enabled: true,
      guildOnly: true,
      nsfw: false,
      aliases: [],
      userPermissions: [],
      clientPermissions: ['ATTACH_FILES'],
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
      if (guildConfig.join_image === 'off') {
        client.ErrorEmbed(
          message,
          "L'image de Bienvenue est désactivé sur ce serveur, faites la commande `h!join_image on` pour l'activer."
        )
        return
      } else {
        message.channel.send({
          embed: {
            color: 0xb1072e,
            description:
              "L'image de Bienvenue : **" +
              guildConfig.join_image_url +
              '**\nPour le changer, faites `' +
              guildConfig.prefix +
              "join_image [url]`\nPour remettre l'image par défaut, faites `" +
              guildConfig.prefix +
              'join_image reset`\nPour le désactiver, faites `' +
              guildConfig.prefix +
              'join_image off`',
          },
        })
        return
      }
    } else if (option === 'off') {
      if (guildConfig.join_image === 'off') {
        client.ErrorEmbed(
          message,
          "L'image de Bienvenue déjà désactivé sur ce serveur, faites la commande `h!join_image on` pour l'activer."
        )
        return
      }
      client.updateGuild(message.guild.id, {
        join_image: 'off',
      })
      client.SuccesEmbed(
        message,
        "L'image de Bienvenue de ce serveur a été désactivé !"
      )
    } else if (option === 'on') {
      if (guildConfig.join_image === 'on') {
        client.ErrorEmbed(
          message,
          "L'image de Bienvenue déjà activé sur ce serveur, faites la commande `h!join_image off` pour le désactiver"
        )
        return
      }
      client.updateGuild(message.guild.id, {
        join_image: 'on',
      })
      client.SuccesEmbed(
        message,
        "L'image de Bienvenue de ce serveur a été activé !"
      )
    } else if (option === 'reset') {
      if (guildConfig.join_image === 'off') {
        client.ErrorEmbed(
          message,
          "L'image de Bienvenue est désactivé sur ce serveur, faites la commande `h!join_image on` pour l'activer."
        )
        return
      }
      client.updateGuild(message.guild.id, {
        join_image_url: 'https://images8.alphacoders.com/108/1081308.png',
      })
      client.SuccesEmbed(
        message,
        "L'image de Bienvenue de ce serveur a été réinitialisé !"
      )
    } else {
      if (guildConfig.join_image === 'off') {
        client.ErrorEmbed(
          message,
          "L'image de Bienvenue est désactivé sur ce serveur, faites la commande `h!join_message on` pour l'activer."
        )
        return
      }
      if (!isImageUrl(args.join(' '))) {
        client.ErrorEmbed(message, "L'URL que vous avez mis est incorrecte !.")
        return
      }
      client.updateGuild(message.guild.id, {
        join_image_url: args.join(' '),
      })
      message.channel.send({
        embed: {
          title: 'Image de Bienvenue modifié!',
          color: 65349,
          image: {
            url: args.join(' '),
          },
        },
      })
    }
  }
}
