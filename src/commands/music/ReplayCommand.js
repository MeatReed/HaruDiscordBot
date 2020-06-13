const BaseCommand = require('../../utils/structures/BaseCommand')

module.exports = class ReplayCommand extends BaseCommand {
  constructor() {
    super({
      name: 'replay',
      description: '',
      category: '🎸 Musique',
      usage: 'replay',
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
      client.queue.LAVALINK,
      message.guild.id
    )
    try {
      if (queue[0].loop) {
        await player.stop()
      } else {
        queue[0].loop = true
        await player.stop()
        setTimeout(() => {
          queue[0].loop = false
        }, 1000)
      }
      return
    } catch (error) {
      if (error) {
        return client.ErrorEmbed(
          message,
          'Une erreur est survenue : \n```JS\n' + error.message + '```'
        )
      }
    }
  }
}
