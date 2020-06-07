const BaseCommand = require('../../utils/structures/BaseCommand')

module.exports = class PlayCommand extends BaseCommand {
  constructor() {
    super({
      name: 'play',
      description: '',
      category: '🎸 Musique',
      usage: 'play {nom ou lien de la musique}',
      enabled: true,
      guildOnly: true,
      nsfw: false,
      aliases: [],
      userPermissions: [],
      clientPermissions: ['CONNECT', 'SPEAK'],
    })
  }

  async run(client, message, args) {
    const search = args.join(' ')

    if (!message.member.voice.channel) {
      client.ErrorEmbed(
        message,
        'Veuillez vous connecter dans un salon vocal !'
      )
      return
    }

    if (!search) {
      client.ErrorEmbed(
        message,
        "N'oubliez pas de mettre une recherche ou un lien Youtube !"
      )
      return
    }
    const player = await client.manager.players.get(message.guild.id)
    try {
      if (!player) {
        await client.manager.join({
          guild: message.guild.id,
          channel: message.member.voice.channelID,
          node: client.manager.idealNodes[0].id,
        })
        if (!message.guild.me.voice.channel) {
          client.SuccesEmbed(
            message,
            'Le bot a rejoint le salon vocal avec succès **' +
              message.member.voice.channel.toString() +
              '** !'
          )
        }
      }
      await client.music.addToQueue(client, message, search)
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
