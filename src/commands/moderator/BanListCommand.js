const BaseCommand = require('../../utils/structures/BaseCommand')
const Pagination = require('discord-paginationembed')

module.exports = class BanListCommand extends BaseCommand {
  constructor() {
    super({
      name: 'banlist',
      description: '',
      category: 'Modération',
      usage: 'banlist',
      enabled: true,
      guildOnly: true,
      nsfw: false,
      aliases: [],
      userPermissions: ['BAN_MEMBERS'],
      clientPermissions: ['BAN_MEMBERS'],
    })
  }

  async run(client, message, args) {
    const banlist = await message.guild.fetchBans()
    let banlistArray = []
    await banlist.forEach((element) => {
      banlistArray.push({
        reason: element.reason,
        user: element.user,
      })
    })
    const FieldsEmbed = new Pagination.FieldsEmbed()
      .setArray(banlistArray)
      .setChannel(message.channel)
      .setElementsPerPage(5)
      .setPageIndicator('footer', (page, pages) => `Page ${page} / ${pages}`)
      .formatField(
        `# - Banlist`,
        (el) =>
          `${el.user.tag}(${el.user.id})\nRaison : ${
            el.reason ? el.reason : 'Aucune raison spécifié.'
          }\n`
      )
    FieldsEmbed.embed
      .setColor(0xb1072e)
      .setFooter(
        'Demandée par ' + message.author.tag,
        message.author.avatarURL()
      )
    FieldsEmbed.build()
  }
}
