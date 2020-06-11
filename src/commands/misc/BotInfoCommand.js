const BaseCommand = require('../../utils/structures/BaseCommand')
const os = require('os')
const status = {
  online: '<:online:686651497617948721> En ligne',
  idle: '<:idle:686652885593096305> Idle',
  dnd: '<:dnd:686650899329974336> Ne pas déranger',
  offline: '<:offline:686652886150676598> Offline/Invisible',
}
const moment = require('moment-fr')
require('moment-duration-format')

module.exports = class BotInfoCommand extends BaseCommand {
  constructor() {
    super({
      name: 'botinfo',
      description: '',
      category: 'Misc',
      usage: 'botinfo',
      enabled: true,
      guildOnly: true,
      nsfw: false,
      aliases: [],
      userPermissions: [],
      clientPermissions: [],
    })
  }

  async run(client, message, args) {
    try {
      const ownerUser = client.getOwner()

      function convertMS(ms) {
        var d, h, m, s
        s = Math.floor(ms / 1000)
        m = Math.floor(s / 60)
        s = s % 60
        h = Math.floor(m / 60)
        m = m % 60
        d = Math.floor(h / 24)
        h = h % 24
        return {
          d: d,
          h: h,
          m: m,
          s: s,
        }
      }

      let u = convertMS(client.uptime)
      let uptime =
        u.d +
        ' jours : ' +
        u.h +
        ' heures : ' +
        u.m +
        ' minutes : ' +
        u.s +
        ' secondes'
      message.channel.send({
        embed: {
          description:
            "S'il y a un problème, vous pouvez faire la commande " +
            `***${client.prefix}report {raison}***` +
            ' ou envoyez moi un message privé `' +
            ownerUser.tag +
            '`\n------------------------------------------------------------------------------',
          color: 0xb1072e,
          footer: {
            icon_url: message.author.avatarURL(),
            text: 'Demandée par ' + message.author.tag,
          },
          thumbnail: {
            url: client.user.avatarURL(),
          },
          author: {
            name: `${client.user.username} Info`,
          },
          fields: [
            {
              name: 'Nom du bot',
              value: `${client.user.username}`,
              inline: true,
            },
            {
              name: 'Id du bot',
              value: `${client.user.id}`,
              inline: true,
            },
            {
              name: 'Library',
              value: 'discord.js',
              inline: true,
            },
            {
              name: 'Status du bot',
              value: `${status[client.user.presence.status]}`,
              inline: true,
            },
            {
              name: 'Créateur du bot',
              value: ownerUser.tag,
            },
            {
              name: 'Id du créateur du bot',
              value: ownerUser.id,
              inline: true,
            },
            {
              name: `Serveurs`,
              value: `${client.guilds.cache.size}`,
              inline: true,
            },
            {
              name: `Utilisateurs`,
              value: `${client.users.cache.size}`,
              inline: true,
            },
            /*{
                name: 'Site',
                value: 'http://tateyama.meatreed.ovh/',
                inline: true,
              },*/
            {
              name: 'Paypal',
              value: 'https://paypal.me/MeatRed',
            },
            {
              name: 'Uptime',
              value: `${uptime}`,
            },
            {
              name: 'CPU',
              value: `${os.cpus().map((i) => `${i.model}`)[0]}`,
              inline: true,
            },
            {
              name: 'Arch',
              value: os.arch(),
              inline: true,
            },
            {
              name: 'Platform',
              value: os.platform(),
              inline: true,
            },
          ],
        },
      })
    } catch (error) {
      client.ErrorEmbed(
        message,
        'Une erreur est survenue : \n```JS\n' + error.message + '```'
      )
    }
  }
}
