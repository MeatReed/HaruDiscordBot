const BaseCommand = require('../../utils/structures/BaseCommand')

module.exports = class ResumeCommand extends BaseCommand {
  constructor() {
    super({
      name: 'resume',
      description: '',
      category: '🎸 Musique',
      usage: 'resume',
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
    try {
      if (player.paused === true) {
        await player.pause(false)
        client.SuccesEmbed(message, 'La musique a repris !')
      } else {
        client.ErrorEmbed(message, "La musique est déjà entrain d'être joué !")
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
