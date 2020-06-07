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
      guildOnly: false,
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
        `<@${message.author.id}> a insulté <@${message.author.id}> de baka.. Oh wait !`,
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
      message.channel.send(
        `<@${message.author.id}> a insulté <@${user.id}> de baka !`,
        {
          embed: {
            color: 0xb1072e,
            image: {
              url: response.data.url,
            },
            footer: {
              text: 'Généré avec https://nekos.life/',
            },
          },
        }
      )
    }
  }
}
