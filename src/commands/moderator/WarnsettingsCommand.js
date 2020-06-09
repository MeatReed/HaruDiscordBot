const BaseCommand = require('../../utils/structures/BaseCommand')
const Pagination = require('discord-paginationembed')

module.exports = class WarnsettingsCommand extends BaseCommand {
  constructor() {
    super({
      name: 'warnsettings',
      description: '',
      category: 'Modération',
      usage: 'warnsettings',
      enabled: true,
      guildOnly: true,
      nsfw: false,
      aliases: [],
      userPermissions: ['BAN_MEMBERS', 'KICK_MEMBERS', 'MANAGE_ROLES'],
      clientPermissions: ['BAN_MEMBERS', 'KICK_MEMBERS', 'MANAGE_ROLES'],
    })
  }

  async run(client, message, args) {
    const option = args[0]
    if (!option) {
      client.ErrorEmbed(
        message,
        'Aucune option spécifié, faites la commande `h!warnsettings list` pour voir la liste des options disponibles.'
      )
      return
    } else if (option === 'list') {
      const ownerUser = client.getOwner()
      message.channel.send({
        embed: {
          title: 'Liste des options disponibles',
          description:
            "S'il y a un problème, vous pouvez faire la commande " +
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
              name: 'h!warnsettings add [nombre de warn] [mute/kick/ban]',
              value:
                "**Description:** Permet de mettre une sanction selon le nombre d'avertissement.\n**Exemple:** h!warnsettings add 3 kick",
            },
            {
              name: 'h!warnsettings remove [mute/kick/ban]',
              value:
                '**Description:** Permet de supprimer une sanction.\n**Exemple:** h!warnsettings remove kick',
            },
            {
              name: 'h!warnsettings sanctionlist',
              value:
                "**Description:** Permet d'afficher la liste des sanctions configurées sur le serveur.\n**Exemple:** h!warnsettings sanctionlist",
            },
          ],
        },
      })
    } else if (option === 'add') {
      const warnAmount = parseInt(args[1])
      const sanction = args[2]
      if (!warnAmount) {
        client.ErrorEmbed(
          message,
          "Vous n'avez pas mis les nombres d'avertissement !"
        )
        return
      } else if (isNaN(warnAmount)) {
        client.ErrorEmbed(
          message,
          'Le nombre que vous avez mis est incorrect !'
        )
      }
      if (!sanction) {
        client.ErrorEmbed(
          message,
          "Vous n'avez pas mis la sanction, voici les sanctions disponible `mute/kick/ban`."
        )
        return
      } else if (sanction === 'mute') {
        const checkSanction = await client.getSanctionWithSanction(
          message.guild.id,
          'mute'
        )
        if (!checkSanction) {
          await client.setSanction(message.guild.id, warnAmount, sanction)
          client.SuccesEmbed(
            message,
            `La sanction \`${sanction}\` a bien été mis ! Lorsque qu'un utilisateur obtiendra ${warnAmount} avertissements, il sera automatiquement réduit au silence !`
          )
        } else {
          client.ErrorEmbed(
            message,
            `La sanction \`${sanction}\` existe déjà ! ${checkSanction.warnAmount} avertissement(s)`
          )
        }
      } else if (sanction === 'kick') {
        const checkSanction = await client.getSanctionWithSanction(
          message.guild.id,
          'kick'
        )
        if (!checkSanction) {
          await client.setSanction(message.guild.id, warnAmount, sanction)
          client.SuccesEmbed(
            message,
            `La sanction \`${sanction}\` a bien été mis ! Lorsque qu'un utilisateur obtiendra ${warnAmount} avertissements, il sera automatiquement expulser temporairement du serveur !`
          )
        } else {
          client.ErrorEmbed(
            message,
            `La sanction \`${sanction}\` existe déjà ! ${checkSanction.warnAmount} avertissement(s)`
          )
        }
      } else if (sanction === 'ban') {
        const checkSanction = await client.getSanctionWithSanction(
          message.guild.id,
          'ban'
        )
        if (!checkSanction) {
          await client.setSanction(message.guild.id, warnAmount, sanction)
          client.SuccesEmbed(
            message,
            `La sanction \`${sanction}\` a bien été mis ! Lorsque qu'un utilisateur obtiendra ${warnAmount} avertissements, il sera automatiquement expulser définitivement du serveur !`
          )
        } else {
          client.ErrorEmbed(
            message,
            `La sanction \`${sanction}\` existe déjà ! ${checkSanction.warnAmount} avertissement(s)`
          )
        }
      } else {
        client.ErrorEmbed(
          message,
          "La sanction que vous avez mis est incorrecte ou n'existe pas, voici les sanctions disponible `mute/kick/ban`."
        )
        return
      }
    } else if (option === 'remove') {
      const sanction = args[1]
      if (!sanction) {
        client.ErrorEmbed(
          message,
          "Vous n'avez pas mis la sanction, voici les sanctions disponible `mute/kick/ban`."
        )
        return
      } else if (sanction === 'mute') {
        const checkSanction = await client.getSanctionWithSanction(
          message.guild.id,
          'mute'
        )
        if (checkSanction) {
          await client.delSanction(message.guild.id, sanction)
          client.SuccesEmbed(
            message,
            `La sanction \`${sanction}\` a bien été supprimée !`
          )
        } else {
          client.ErrorEmbed(
            message,
            `La sanction \`${sanction}\` n'a pas été définie !`
          )
        }
      } else if (sanction === 'kick') {
        const checkSanction = await client.getSanctionWithSanction(
          message.guild.id,
          'kick'
        )
        if (checkSanction) {
          await client.delSanction(message.guild.id, sanction)
          client.SuccesEmbed(
            message,
            `La sanction \`${sanction}\` a bien été supprimée !`
          )
        } else {
          client.ErrorEmbed(
            message,
            `La sanction \`${sanction}\` n'a pas été définie !`
          )
        }
      } else if (sanction === 'ban') {
        const checkSanction = await client.getSanctionWithSanction(
          message.guild.id,
          'ban'
        )
        if (checkSanction) {
          await client.delSanction(message.guild.id, sanction)
          client.SuccesEmbed(
            message,
            `La sanction \`${sanction}\` a bien été supprimée !`
          )
        } else {
          client.ErrorEmbed(
            message,
            `La sanction \`${sanction}\` n'a pas été définie !`
          )
        }
      } else {
        client.ErrorEmbed(
          message,
          "La sanction que vous avez mis est incorrecte ou n'existe pas, voici les sanctions disponible `mute/kick/ban`."
        )
        return
      }
    } else if (option === 'sanctionlist') {
      const sanctions = await client.getSanctions(message.guild.id)
      if (sanctions) {
        const FieldsEmbed = new Pagination.FieldsEmbed()
          .setArray(sanctions)
          .setChannel(message.channel)
          .setElementsPerPage(5)
          .setPageIndicator(
            'footer',
            (page, pages) => `Page ${page} / ${pages}`
          )
          .formatField(
            `# - Sanctionlist`,
            (el, i) =>
              `${i} - \`${el.warnAmount}\` avertissement(s)\nSanction \`${el.sanction}\`\n`
          )
        FieldsEmbed.embed
          .setColor(0xb1072e)
          .setDescription(
            '**Si vous voulez supprimer une sanction vous devez faire la commande\n`h!warnsettings [mute/kick/ban]`**'
          )
          .setFooter(
            'Demandée par ' + message.author.tag,
            message.author.avatarURL()
          )
        FieldsEmbed.build()
      } else {
        client.ErrorEmbed(
          message,
          "Aucune sanction n'a été définie sur ce serveur."
        )
        return
      }
    } else {
      client.ErrorEmbed(message, 'Aucune option spécifié.')
    }
  }
}
