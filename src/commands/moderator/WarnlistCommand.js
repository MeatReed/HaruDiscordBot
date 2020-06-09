const BaseCommand = require('../../utils/structures/BaseCommand')
const Pagination = require('discord-paginationembed')
const moment = require('moment-fr')

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
      aliases: ['warns', 'warnls'],
      userPermissions: ['BAN_MEMBERS', 'KICK_MEMBERS'],
      clientPermissions: [
        'BAN_MEMBERS',
        'KICK_MEMBERS',
        'MANAGE_ROLES',
        'MANAGE_CHANNELS',
      ],
    })
  }

  async run(client, message, args) {
    const user = client.fetchUser(args.join(' '), message)
    if (!user) {
      client.ErrorEmbed(message, 'Utilisateur introuvable !')
      return
    }
    const warns = await client.userWarnsList(message.guild.id, user.id)
    if (!warns[0]) {
      message.channel.send(`\`${user.tag}\` ne possède aucun avertissement.`)
      return
    }
    const FieldsEmbed = new Pagination.FieldsEmbed()
      .setArray(warns)
      .setChannel(message.channel)
      .setElementsPerPage(5)
      .setPageIndicator('footer', (page, pages) => `Page ${page} / ${pages}`)
      .formatField(
        `# - Warnlist \`${user.tag}(${user.id})\``,
        (el, i) =>
          `${i} - ${
            el.reason ? el.reason : 'Aucune raison spécifié.'
          }\nAverti par \`${
            client.fetchUser(el.by, message).user.tag
          }\` le ${moment(el.created_at).format('LLL')}\n`
      )
    FieldsEmbed.embed
      .setColor(0xb1072e)
      .setDescription(
        '**Si vous voulez supprimer un warn vous devez faire la commande\n`h!warnremove [ID du warn | all] [utilisateur]`**'
      )
      .setFooter(
        'Demandée par ' + message.author.tag,
        message.author.avatarURL()
      )
    FieldsEmbed.build()
  }
}
