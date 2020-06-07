const BaseCommand = require('../../utils/structures/BaseCommand')
const ytdl = require('ytdl-core')
const moment = require('moment')

module.exports = class NpCommand extends BaseCommand {
  constructor() {
    super({
      name: 'np',
      description: '',
      category: '🎸 Musique',
      usage: 'np',
      enabled: true,
      guildOnly: true,
      nsfw: false,
      aliases: ['nowplaying'],
      userPermissions: [],
      clientPermissions: ['CONNECT', 'SPEAK'],
    })
  }

  async run(client, message) {
    const player = await client.manager.players.get(message.guild.id)

    if (!message.member.voice.channel) {
      client.ErrorEmbed(message, "Vous n'êtes pas dans un salon vocal !")
      return
    }

    if (!player) {
      client.ErrorEmbed(message, 'Haru ne joue actuellement pas de musique.')
      return
    }

    if (message.guild.me.voice.channel.id !== message.member.voice.channel.id) {
      client.ErrorEmbed(
        message,
        "Vous n'êtes pas dans le même salon vocal que Haru !"
      )
      return
    }
    let queue = client.music.getCurrentQueue(
      client.queue.QUEUES,
      message.guild.id
    )
    ytdl.getInfo(queue[0].info.url).then(async function (info) {
      let desc = info.description
      let text = ''

      text = `<:true:644637367935959041> Joue: [${queue[0].info.title}](${queue[0].info.url})\n\n**Description:**\n\n${desc}`

      if (text.length > 2040) {
        text = text.substr(0, 2040)
        text = text + '\n...'
      } else {
        text = text
      }

      let duration = moment.duration({
        ms: queue[0].info.duration,
      })

      await message.channel.send({
        embed: {
          description: text,
          color: 16711717,
          thumbnail: {
            url: queue[0].info.thumbnails,
          },
          author: {
            name: message.author.tag,
            icon_url: message.author.avatarURL,
          },
          fields: [
            {
              name: 'Auteur',
              value: queue[0].info.author,
              inline: true,
            },
            {
              name: 'Durée de la musique',
              value: `${duration.minutes()}:${duration.seconds()}`,
              inline: true,
            },
            {
              name: 'Demandée par',
              value: queue[0].author,
              inline: true,
            },
            {
              name: 'Boucle',
              value: queue[0].loop === false ? 'Désactivée' : 'Activée',
              inline: true,
            },
            {
              name: 'Shuffle',
              value: player.shuffle === false ? 'Désactivée' : 'Activée',
              inline: true,
            },
          ],
        },
      })
    })
  }
}
