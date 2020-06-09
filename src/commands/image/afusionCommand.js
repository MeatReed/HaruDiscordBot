const BaseCommand = require('../../utils/structures/BaseCommand')

module.exports = class AfusionCommand extends BaseCommand {
  constructor() {
    super({
      name: 'afusion',
      description: '',
      category: 'Images',
      usage: 'afusion [utilisateur1] {utilisateur2}',
      enabled: true,
      guildOnly: true,
      nsfw: false,
      aliases: [],
      userPermissions: [],
      clientPermissions: ['ATTACH_FILES'],
    })
  }

  async run(client, message, args) {
    const loading = await message.channel.send(
      "Génération de l'image.. <a:loading:644636255006490640>"
    )
    if (!args[0]) {
      loading.delete()
      client.ErrorEmbed(message, 'Utilisateur1 introuvable !')
      return
    }
    const user1 = client.fetchUser(args[0], message)
    const user2 = client.fetchUser(args[1] || '', message)
    client.ameApi
      .generate('afusion', {
        url: user1.avatarURL({
          format: 'png',
          dynamic: false,
          size: 2048,
        }),
        avatar: user2.avatarURL({
          format: 'png',
          dynamic: false,
          size: 2048,
        }),
      })
      .then((image) => {
        loading.delete()
        message.channel.send('Généré avec Amethyste API', {
          files: [
            {
              attachment: image,
              name: 'afusion.png',
            },
          ],
        })
      })
      .catch((error) => {
        loading.delete()
        client.ErrorEmbed(
          message,
          'Une erreur est survenue : \n```JS\n' + error.message + '```'
        )
      })
  }
}
