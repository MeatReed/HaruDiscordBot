const BaseCommand = require('../../utils/structures/BaseCommand')

module.exports = class GenerateCommand extends BaseCommand {
  constructor() {
    super({
      name: 'generate',
      description: '',
      category: 'Images',
      usage: 'generate [endpoint] {utilisateur}',
      enabled: true,
      guildOnly: true,
      nsfw: false,
      aliases: [],
      userPermissions: [],
      clientPermissions: ['ATTACH_FILES'],
    })
  }

  async run(client, message, args) {
    const generateEndpoint = [
      '3000years',
      'approved',
      'beautiful',
      'blur',
      'blur',
      'blur',
      'burn',
      'challenger',
      'circle',
      'contrast',
      'crush',
      'ddungeon',
      'deepfry',
      'dictator',
      'distort',
      'dither565',
      'emboss',
      'fire',
      'frame',
      'gay',
      'glitch',
      'greyple',
      'greyscale',
      'instagram',
      'invert',
      'jail',
      'lookwhatkarenhave',
      'magik',
      'missionpassed',
      'moustache',
      'pixelize',
      'ps4',
      'posterize',
      'rejected',
      'redple',
      'rip',
      'scary',
      'sepia',
      'sharpen',
      'sniper',
      'thanos',
      'trinity',
      'tobecontinued',
      'spin',
      'subzero',
      'triggered',
      'unsharpen',
      'utatoo',
      'wanted',
      'wasted',
    ]
    if (!args[0]) {
      let endpoint = 'Voici la liste de tout les endpoints : '

      for (const endpoints of generateEndpoint) {
        endpoint += '`' + endpoints + '`, '
      }
      message.channel.send(endpoint)
      return
    } else {
      if (!generateEndpoint.includes(args[0])) {
        client.ErrorEmbed(message, 'Endpoint introuvable !')
        return
      }
      const loading = await message.channel.send(
        "Génération de l'image.. <a:loading:644636255006490640>"
      )
      const user = client.fetchUser(args.slice(1).join(' '), message)
      client.ameApi
        .generate(args[0], {
          url: user.avatarURL({
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
                name: `${args[0]}${args[0] === 'triggered' ? '.gif' : '.png'}`,
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
}
