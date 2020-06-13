const BaseCommand = require('../../utils/structures/BaseCommand')
const moment = require('moment')
const Discord = require('discord.js')
const Pagination = require('discord-paginationembed')

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
    const queue = client.music.getCurrentQueue(
      client.queue.LAVALINK,
      message.guild.id
    )
    const nowplaying = queue[0]
    const songs = queue.slice(1)
    if (songs[0]) {
      const FieldsEmbed = new Pagination.FieldsEmbed()
        .setArray(songs)
        .setChannel(message.channel)
        .setElementsPerPage(5)
        .setPageIndicator('footer', (page, pages) => `Page ${page} / ${pages}`)
        .formatField(
          `# - Queue`,
          (el) =>
            `**[${el.info.title}](${el.info.url})**\nDurée : ${moment
              .duration({
                ms: el.info.duration,
              })
              .minutes()}:${moment
              .duration({
                ms: el.info.duration,
              })
              .seconds()} | Demandée par : ${el.author}\n\n`
        )
      FieldsEmbed.embed
        .setColor(16711717)
        .setDescription(
          `**Joue: [${nowplaying.info.title}](${nowplaying.info.url})**`
        )
        .setFooter(
          'Demandée par ' + message.author.tag,
          message.author.avatarURL()
        )
      FieldsEmbed.build()
    } else {
      const Embed = new Discord.MessageEmbed()
        .setColor(16711717)
        .setDescription(
          `**Joue: [${nowplaying.info.title}](${nowplaying.info.url})**`
        )
        .setFooter(
          'Demandée par ' + message.author.tag,
          message.author.avatarURL()
        )
      message.channel.send(Embed)
    }
  }
}
