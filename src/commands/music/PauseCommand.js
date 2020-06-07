const BaseCommand = require('../../utils/structures/BaseCommand')

module.exports = class PauseCommand extends BaseCommand {
  constructor() {
    super({
      name: 'pause',
      description: '',
      category: '🎸 Musique',
      usage: 'pause',
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
      if (player.paused === false) {
        await player.pause(true)
        client.SuccesEmbed(message, 'La musique a été mis en pause')
      } else {
        client.ErrorEmbed(message, 'La musique est déjà en pause !')
      }
    } catch (error) {
      if (error) {
        client.ErrorEmbed(
          message,
          'Une erreur est survenue : \n```JS\n' + error.message + '```'
        )
        return
      }
    }
  }
}
