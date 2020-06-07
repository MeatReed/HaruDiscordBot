const BaseCommand = require('../../utils/structures/BaseCommand')
const Pagination = require('discord-paginationembed')

module.exports = class WarnremoveCommand extends BaseCommand {
  constructor() {
    super({
      name: 'warnremove',
      description: '',
      category: 'Modération',
      usage: 'warnremove [ID du warn | all] [utilisateur]',
      enabled: true,
      guildOnly: true,
      nsfw: false,
      aliases: ['warnrm'],
      userPermissions: [],
      clientPermissions: [],
    })
  }

  async run(client, message, args) {
    const warnID = args[0]
    if (!warnID) {
      client.ErrorEmbed(
        message,
        "Vous n'avez pas spécifié l'ID du warn que vous voulez supprimer, faites la commande `h!warnlist {utilisateur}` pour connaître l'ID."
      )
      return
    }
    if (!args[1]) {
      client.ErrorEmbed(message, 'Aucun utilisateur spécifié.')
      return
    }
    const user = client.fetchUser(args[1], message)
    if (!user) {
      client.ErrorEmbed(message, 'Utilisateur introuvable !')
      return
    }
    if (warnID === 'all') {
      if (await client.checkWarn(0, message.guild.id, user.id)) {
        await client.clearWarns(message.guild.id, user.id)
        client.SuccesEmbed(
          message,
          `Tout les avertissement de \`${user.tag}\` ont bien été supprimés !`
        )
      } else {
        client.ErrorEmbed(
          message,
          `\`${user.tag}\` ne possède aucun avertissement.`
        )
      }
    } else {
      if (await client.checkWarn(warnID, message.guild.id, user.id)) {
        await client.delWarn(warnID, message.guild.id, user.id)
        client.SuccesEmbed(
          message,
          `L'avertissement numéro \`${warnID}\` a bien été supprimé !`
        )
      } else {
        client.ErrorEmbed(
          message,
          "L'ID du warn mis est incorrect ! Faites la commande `h!warnlist {utilisateur}` pour connaître l'ID."
        )
      }
    }
  }
}
