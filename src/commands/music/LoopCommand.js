const BaseCommand = require('../../utils/structures/BaseCommand')

module.exports = class LoopCommand extends BaseCommand {
  constructor() {
    super({
      name: 'loop',
      description: '',
      category: '🎸 Musique',
      usage: 'loop',
      enabled: true,
      guildOnly: true,
      nsfw: false,
      aliases: ['boucle'],
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
      if (!queue[0].loop) {
        queue[0].loop = true
        client.SuccesEmbed(
          message,
          `Boucle activée, la musique ${queue[0].info.title} va se répéter.`
        )
        return
      } else {
        queue[0].loop = false
        client.SuccesEmbed(message, 'Boucle désactivée.')
        return
      }
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
