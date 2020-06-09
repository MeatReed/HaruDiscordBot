const BaseCommand = require('../../utils/structures/BaseCommand')

module.exports = class WallpaperCommand extends BaseCommand {
  constructor() {
    super({
      name: 'wallpaper',
      description: '',
      category: 'Images',
      usage: 'wallpaper',
      enabled: true,
      guildOnly: true,
      nsfw: false,
      aliases: [],
      userPermissions: [],
      clientPermissions: ['ATTACH_FILES'],
    })
  }

  async run(client, message, args) {
    client.ameApi
      .image('wallpaper')
      .then((response) => {
        message.channel.send('Généré avec Amethyste API', {
          files: [
            {
              attachment: response.url,
              name: 'wallpaper.png',
            },
          ],
        })
      })
      .catch((error) => {
        client.ErrorEmbed(
          message,
          'Une erreur est survenue : \n```JS\n' + error.message + '```'
        )
      })
  }
}
