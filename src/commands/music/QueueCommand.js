const BaseCommand = require('../../utils/structures/BaseCommand')
const moment = require('moment')

module.exports = class QueueCommand extends BaseCommand {
  constructor() {
    super({
      name: 'queue',
      description: '',
      category: '🎸 Musique',
      usage: 'queue',
      enabled: true,
      guildOnly: true,
      nsfw: false,
      aliases: [],
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
    let text = ''
    for (let i = 1; i < queue.length; i++) {
      let duration = moment.duration({
        ms: queue[i].info.duration,
      })
      text += `${i} - [${queue[i].info.title}](${
        queue[i].info.url
      })\nDurée : ${duration.minutes()}:${duration.seconds()} | Demandée par : ${
        queue[i].author
      }\n\n`
    }
    text += `\n\nJoue: [${queue[0].info.title}](${queue[0].info.url})`
    if (text.length > 2048) {
      text = text.substr(0, 2048)
      text = text + '...'
    }
    message.channel.send({
      embed: {
        description: text,
        color: 16711717,
        footer: {
          icon_url: message.author.avatarURL(),
          text: 'Demandée par ' + message.author.tag,
        },
      },
    })
  }
}
