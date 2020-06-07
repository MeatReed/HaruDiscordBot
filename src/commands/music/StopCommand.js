const BaseCommand = require('../../utils/structures/BaseCommand')

module.exports = class StopCommand extends BaseCommand {
  constructor() {
    super({
      name: 'stop',
      description: '',
      category: '🎸 Musique',
      usage: 'stop',
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
    if (queue.length > 0) {
      queue.splice(0, queue.length)
    }
    try {
      client.manager.leave(message.guild.id)
      client.SuccesEmbed(message, "La musique s'est bien arrêtée.")
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
