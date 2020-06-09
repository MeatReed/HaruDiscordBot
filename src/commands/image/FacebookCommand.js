const BaseCommand = require('../../utils/structures/BaseCommand')

module.exports = class CrushCommand extends BaseCommand {
  constructor() {
    super({
      name: 'facebook',
      description: '',
      category: 'Images',
      usage: 'facebook [utilisateur] {message}',
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
      client.ErrorEmbed(message, 'Utilisateur non spécifié !')
      return
    }
    const user = client.fetchUser(args[0], message)
    const msg = args.slice(1).join(' ')
    client.ameApi
      .generate('facebook', {
        url: user.avatarURL({
          format: 'png',
          dynamic: false,
          size: 2048,
        }),
        text: msg,
      })
      .then((image) => {
        loading.delete()
        message.channel.send('Généré avec Amethyste API', {
          files: [
            {
              attachment: image,
              name: 'facebook.png',
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
