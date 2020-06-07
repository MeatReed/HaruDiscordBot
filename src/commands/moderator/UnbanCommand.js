const BaseCommand = require('../../utils/structures/BaseCommand')
const Pagination = require('discord-paginationembed')

module.exports = class UnbanCommand extends BaseCommand {
  constructor() {
    super({
      name: 'unban',
      description: '',
      category: 'Modération',
      usage: 'unban',
      enabled: true,
      guildOnly: true,
      nsfw: false,
      aliases: [],
      userPermissions: [],
      clientPermissions: [],
    })
  }

  async run(client, message, args) {
    const userID = args[0]
    console.log(userID)
    if (userID) {
      message.guild.members
        .unban(userID)
        .then((user) => {
          client.SuccesEmbed(
            message,
            `\`${user.tag}\` a été debanni avec succès !`
          )
        })
        .catch((error) => {
          client.ErrorEmbed(message, 'Utilisateur introuvable !')
        })
    } else {
      client.ErrorEmbed(
        message,
        "Vous n'avez pas spécifié l'ID de l'utilisateur que vous voulez débannir, faites la commande `h!banlist` pour connaître l'ID."
      )
    }
  }
}
