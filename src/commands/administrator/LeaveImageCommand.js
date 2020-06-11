const BaseCommand = require('../../utils/structures/BaseCommand')
const isImageUrl = require('is-image-url')
const isHexcolor = require('is-hexcolor')

module.exports = class LeaveImageCommand extends BaseCommand {
  constructor() {
    super({
      name: 'leave_image',
      description: '',
      category: 'Administration',
      usage: 'leave_image',
      enabled: true,
      guildOnly: true,
      nsfw: false,
      aliases: [],
      userPermissions: ['ADMINISTRATOR'],
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
            "Vous n'avez pas mis le salon pour le message d'Adieu et d'Adieu.\nPour mettre un salon faites, faites `h!setchannel {salon}`",
        },
      })
    } else if (!args[0]) {
      if (guildConfig.leave_image === 'off') {
        client.ErrorEmbed(
          message,
          "L'image d'Adieu est désactivé sur ce serveur, faites la commande `h!leave_image on` pour l'activer."
        )
        return
      } else {
        const ownerUser = client.getOwner()
        message.channel.send({
          embed: {
            title: "Image d'Adieu",
            description:
              "L'image actuel de votre serveur est **" +
              guildConfig.leave_image_url +
              "**.\n\nS'il y a un problème, vous pouvez faire la commande " +
              `***${client.prefix}report {raison}***` +
              ' ou envoyez moi un message privé `' +
              ownerUser.tag +
              '`\n------------------------------------------------------------------------------',
            color: 0xb1072e,
            image: {
              url: guildConfig.leave_image_url,
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
                name: 'h!leave_image [on/off]',
                value:
                  "**Description:** Permet d'activer ou de désactiver l'image d'Adieu.\n**Exemple:** `h!leave_image on`",
              },
              {
                name: 'h!leave_image url [image]',
                value:
                  "**Description:** Permet de changer l'image d'Adieu.\n**Exemple:** `h!leave_image url https://images3.alphacoders.com/105/thumb-1920-1058494.jpg`",
              },
              {
                name: 'h!leave_image reset',
                value:
                  '**Description:** Permet de mettre les paramètres par défaut(image, message et couleur).\n**Exemple:** `h!leave_image reset`',
              },
              {
                name: 'h!leave_image color [circle/welcome/message] [color]',
                value: `**Description:** Permet de configurer les couleurs sur l'image.\n**Exemple:** \`h!leave_image color circle #ef08ff\`\n\n**Cercle:** ${guildConfig.leave_image_color_circle}\n**BIENVENUE:** ${guildConfig.leave_image_color_welcome}\n**Message:** ${guildConfig.leave_image_color_message}`,
              },
            ],
          },
        })
        return
      }
    } else if (option === 'off') {
      if (guildConfig.leave_image === 'off') {
        client.ErrorEmbed(
          message,
          "L'image d'Adieu déjà désactivé sur ce serveur, faites la commande `h!leave_image on` pour l'activer."
        )
        return
      }
      client.updateGuild(message.guild.id, {
        leave_image: 'off',
      })
      client.SuccesEmbed(
        message,
        "L'image d'Adieu de ce serveur a été désactivé !"
      )
    } else if (option === 'on') {
      if (guildConfig.leave_image === 'on') {
        client.ErrorEmbed(
          message,
          "L'image d'Adieu déjà activé sur ce serveur, faites la commande `h!leave_image off` pour le désactiver"
        )
        return
      }
      client.updateGuild(message.guild.id, {
        leave_image: 'on',
      })
      client.SuccesEmbed(
        message,
        "L'image d'Adieu de ce serveur a été activé !"
      )
    } else if (option === 'reset') {
      if (guildConfig.leave_image === 'off') {
        client.ErrorEmbed(
          message,
          "L'image d'Adieu est désactivé sur ce serveur, faites la commande `h!leave_image on` pour l'activer."
        )
        return
      }
      client.updateGuild(message.guild.id, {
        leave_image_url: 'https://images8.alphacoders.com/108/1081308.png',
        leave_image_color_circle: '#ffffff',
        leave_image_color_welcome: '#ffffff',
        leave_image_color_message: '#ffffff',
      })
      client.SuccesEmbed(message, "L'image d'Adieu a été réinitialisé !")
    } else if (option === 'url') {
      if (guildConfig.leave_image === 'off') {
        client.ErrorEmbed(
          message,
          "L'image d'Adieu est désactivé sur ce serveur, faites la commande `h!leave_message on` pour l'activer."
        )
        return
      }
      if (!isImageUrl(args[1])) {
        client.ErrorEmbed(message, "L'URL que vous avez mis est incorrecte !")
        return
      }
      client.updateGuild(message.guild.id, {
        leave_image_url: args[1],
      })
      message.channel.send({
        embed: {
          title: "Image d'Adieu modifié!",
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
            leave_image_color_circle: color,
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
            leave_image_color_welcome: color,
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
            leave_image_color_message: color,
          })
          client.SuccesEmbed(
            message,
            'La couleur du message `' +
              guildConfig.leave_message +
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
            '` est incorrect ! Voici les éléments disponibles au changement de couleur `circle, welcome, message`\n**Exemple:** `h!leave_image color circle #ef08ff`'
        )
        return
      }
    } else {
      client.ErrorEmbed(
        message,
        "L'option que vous avez mis est incorrecte ! Faites la commande `h!leave_image` pour voir la liste des options."
      )
    }
  }
}
