const BaseCommand = require('../../utils/structures/BaseCommand')
const axios = require('axios')

module.exports = class BakaCommand extends BaseCommand {
  constructor() {
    super({
      name: 'baka',
      description: "Permet d'insulter un utilisateur de baka.",
      category: 'Fun',
      usage: 'baka {utilisateur}',
      enabled: true,
      guildOnly: true,
      nsfw: false,
      aliases: ['idiot'],
      userPermissions: [],
      clientPermissions: [],
    })
  }

  async run(client, message, args) {
    const user = client.fetchUser(args.join(' '), message)

    if (user.id === message.author.id) {
      message.channel.send(
        `${message.author} a insulté ${message.author} de baka.. Oh wait !`,
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
      const response = await axios.get('https://nekos.life/api/v2/img/baka')
      message.channel.send(`${message.author} a insulté ${user} de baka !`, {
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
