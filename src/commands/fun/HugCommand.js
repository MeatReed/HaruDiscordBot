const BaseCommand = require('../../utils/structures/BaseCommand')
const axios = require('axios')

module.exports = class HugCommand extends BaseCommand {
  constructor() {
    super({
      name: 'hug',
      description: 'Permet de faire un calin à un utilisateur.',
      category: 'Fun',
      usage: 'hug {utilisateur}',
      enabled: true,
      guildOnly: true,
      nsfw: false,
      aliases: ['calin'],
      userPermissions: [],
      clientPermissions: [],
    })
  }

  async run(client, message, args) {
    const user = client.fetchUser(args.join(' '), message)

    if (user.id === message.author.id) {
      message.channel.send(
        `${message.author} a fait un calin à @${message.author}.. Oh wait !`,
        {
          embed: {
            color: 0xb1072e,
            image: {
              url: 'https://media.giphy.com/media/Y4z9olnoVl5QI/giphy.gif',
            },
          },
        }
      )
    } else {
      const response = await axios.get('https://nekos.life/api/v2/img/hug')
      message.channel.send(`${message.author} a fait un calin à ${user} !`, {
        embed: {
          color: 0xb1072e,
          image: {
            url: response.data.url,
          },
          footer: {
            text: 'Généré avec https://nekos.life/',
          },
        },
      })
    }
  }
}
