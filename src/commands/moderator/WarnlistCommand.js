const BaseCommand = require('../../utils/structures/BaseCommand')
const Pagination = require('discord-paginationembed')

module.exports = class WarnlistCommand extends BaseCommand {
  constructor() {
    super({
      name: 'warnlist',
      description: '',
      category: 'Modération',
      usage: 'warnlist {utilisateur}',
      enabled: true,
      guildOnly: true,
      nsfw: false,
      aliases: ['warns'],
      userPermissions: [],
      clientPermissions: [],
    })
  }

  async run(client, message, args) {
    const user = client.fetchUser(args.join(' '), message)
    if (user) {
      const warns = await client.userWarnsList(message.guild.id, user.id)
      if (warns[0]) {
        const FieldsEmbed = new Pagination.FieldsEmbed()
          .setArray(warns)
          .setChannel(message.channel)
          .setElementsPerPage(5)
          .setPageIndicator(
            'footer',
            (page, pages) => `Page ${page} / ${pages}`
          )
          .formatField(
            `# - Warnlist`,
            (el) =>
              `\`${user.tag}(${user.id})\`\nRaison : ${
                el.reason ? el.reason : 'Aucune raison spécifié.'
              } | Averti par \`${client.fetchUser(el.by, message).user.tag}\`\n`
          )
        FieldsEmbed.embed
          .setColor(0xb1072e)
          .setFooter(
            'Demandée par ' + message.author.tag,
            message.author.avatarURL()
          )
        FieldsEmbed.build()
      } else {
        message.channel.send(`\`${user.tag}\` ne possède aucun avertissement.`)
      }
    } else {
      client.ErrorEmbed(message, 'Utilisateur introuvable')
    }
  }
}
