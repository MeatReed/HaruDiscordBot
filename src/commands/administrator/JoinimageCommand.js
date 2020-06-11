const BaseCommand = require('../../utils/structures/BaseCommand')
const isImageUrl = require('is-image-url')
const isHexcolor = require('is-hexcolor')

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
        const ownerUser = client.getOwner()
        message.channel.send({
          embed: {
            title: 'Image de bienvenue',
            description:
              "L'image actuel de votre serveur est **" +
              guildConfig.join_image_url +
              "**.\n\nS'il y a un problème, vous pouvez faire la commande " +
              `***${client.prefix}report {raison}***` +
              ' ou envoyez moi un message privé `' +
              ownerUser.tag +
              '`\n------------------------------------------------------------------------------',
            color: 0xb1072e,
            image: {
              url: guildConfig.join_image_url,
            },
            footer: {
              icon_url: message.author.avatarURL(),
              text: 'Demandée par ' + message.author.tag,
            },
            thumbnail: {
              url: client.user.avatarURL(),
            },
            fields: [
              {
                name: 'h!join_image [on/off]',
                value:
                  "**Description:** Permet d'activer ou de désactiver l'image de bienvenue.\n**Exemple:** `h!join_image on`",
              },
              {
                name: 'h!join_image url [image]',
                value:
                  "**Description:** Permet de changer l'image de bienvenue.\n**Exemple:** `h!join_image url https://images8.alphacoders.com/108/1081308.png`",
              },
              {
                name: 'h!join_image reset',
                value:
                  '**Description:** Permet de mettre les paramètres par défaut(image, message et couleur).\n**Exemple:** `h!join_image reset`',
              },
              {
                name: 'h!join_image color [circle/welcome/message] [color]',
                value: `**Description:** Permet de configurer les couleurs sur l'image.\n**Exemple:** \`h!join_image color circle #ef08ff\`\n\n**Cercle:** ${guildConfig.join_image_color_circle}\n**BIENVENUE:** ${guildConfig.join_image_color_welcome}\n**Message:** ${guildConfig.join_image_color_message}`,
              },
            ],
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
        join_image_color_circle: '#ffffff',
        join_image_color_welcome: '#ffffff',
        join_image_color_message: '#ffffff',
      })
      client.SuccesEmbed(message, "L'image de Bienvenue a été réinitialisé !")
    } else if (option === 'url') {
      if (guildConfig.join_image === 'off') {
        client.ErrorEmbed(
          message,
          "L'image de Bienvenue est désactivé sur ce serveur, faites la commande `h!join_message on` pour l'activer."
        )
        return
      }
      if (!isImageUrl(args[1])) {
        client.ErrorEmbed(message, "L'URL que vous avez mis est incorrecte !")
        return
      }
      client.updateGuild(message.guild.id, {
        join_image_url: args[1],
      })
      message.channel.send({
        embed: {
          title: 'Image de Bienvenue modifié!',
          color: 65349,
          image: {
            url: args[1],
          },
        },
      })
    } else if (option === 'color') {
      const itemChange = args[1]
      const color = args[2]
      if (itemChange === 'circle' && color) {
        if (isHexcolor(color)) {
          client.updateGuild(message.guild.id, {
            join_image_color_circle: color,
          })
          client.SuccesEmbed(
            message,
            'La couleur du cercle a été modifiée avec succès ! `' + color + '`'
          )
        } else {
          client.ErrorEmbed(
            message,
            'La couleur que vous avez mis est incorrecte ! Elle doit être sous forme héxadécimal.\n**Exemple:** #ef08ff'
          )
        }
      } else if (itemChange === 'welcome' && color) {
        if (isHexcolor(color)) {
          client.updateGuild(message.guild.id, {
            join_image_color_welcome: color,
          })
          client.SuccesEmbed(
            message,
            "La couleur du message 'BIENVENUE' a été modifiée avec succès ! `" +
              color +
              '`'
          )
        } else {
          client.ErrorEmbed(
            message,
            'La couleur que vous avez mis est incorrecte ! Elle doit être sous forme héxadécimal.\n**Exemple:** #ef08ff'
          )
        }
      } else if (itemChange === 'message' && color) {
        if (isHexcolor(color)) {
          client.updateGuild(message.guild.id, {
            join_image_color_message: color,
          })
          client.SuccesEmbed(
            message,
            'La couleur du message `' +
              guildConfig.join_message +
              '` a été modifiée avec succès ! `' +
              color +
              '`'
          )
        } else {
          client.ErrorEmbed(
            message,
            'La couleur que vous avez mis est incorrecte ! Elle doit être sous forme héxadécimal.\n**Exemple:** #ef08ff'
          )
        }
      } else {
        client.ErrorEmbed(
          message,
          '`' +
            itemChange +
            '` est incorrect ! Voici les éléments disponibles au changement de couleur `circle, welcome, message`\n**Exemple:** `h!join_image color circle #ef08ff`'
        )
        return
      }
    } else {
      client.ErrorEmbed(
        message,
        "L'option que vous avez mis est incorrecte ! Faites la commande `h!join_image` pour voir la liste des options."
      )
    }
  }
}
