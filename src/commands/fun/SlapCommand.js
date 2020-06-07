const BaseCommand = require('../../utils/structures/BaseCommand')
const axios = require('axios')

module.exports = class SlapCommand extends BaseCommand {
  constructor() {
    super({
      name: 'slap',
      description: 'Permet de giffler à un utilisateur.',
      category: 'Fun',
      usage: 'slap {utilisateur}',
      enabled: true,
      guildOnly: false,
      nsfw: false,
      aliases: ['tapoter'],
      userPermissions: [],
      clientPermissions: [],
    })
  }

  async run(client, message, args) {
    const user = client.fetchUser(args.join(' '), message)

    if (user.id === message.author.id) {
      message.channel.send(
        `<@${message.author.id}> a donné une giffle à <@${message.author.id}>.. Oh wait !`,
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
      const response = await axios.get('https://nekos.life/api/v2/img/slap')
      message.channel.send(
        `<@${message.author.id}> a donné une giffle à <@${user.id}> !`,
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
