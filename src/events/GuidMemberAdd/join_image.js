// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildMemberRemove
const BaseEvent = require('../../utils/structures/BaseEvent')
const axios = require('axios')
const { Canvas } = require('canvas-constructor')
const isImageUrl = require('is-image-url')
Canvas.registerFont('src/fonts/Uni Sans Heavy.otf', 'Discord')

module.exports = class JoinImageEvent extends BaseEvent {
  constructor() {
    super('guildMemberAdd')
  }

  async run(client, member) {
    const guildConfig = await client.getGuild(member.guild.id)
    if (guildConfig.join_image === 'on' && guildConfig.join_channel) {
      const channel = member.guild.channels.cache.get(guildConfig.join_channel)
      if (channel) {
        if (guildConfig.join === 'on') {
          channel.send(
            guildConfig.join_message
              .replace('{user}', member)
              .replace('{username}', member.user.username)
              .replace('{server}', member.guild),
            {
              files: [
                {
                  attachment: await generateImage(member.user),
                  name: 'welcome.png',
                },
              ],
            }
          )
        } else if (
          !isImageUrl(guildConfig.join_image_url) &&
          guildConfig.join === 'on'
        ) {
          channel.send(
            guildConfig.join_message
              .replace('{user}', member)
              .replace('{username}', member.user.username)
              .replace('{server}', member.guild)
          )
        } else {
          channel.send({
            files: [
              {
                attachment: await generateImage(member.user),
                name: 'welcome.png',
              },
            ],
          })
        }
      }
    }

    async function generateImage(data) {
      return new Canvas(1024, 512)
        .save()
        .addImage(await buffer(guildConfig.join_image_url), 0, 0, 1024, 512)
        .setShadowOffsetX(3)
        .setShadowOffsetY(3)
        .setShadowColor('rgba(0,0,0,0.3)')
        .setShadowBlur(6)
        .setColor(guildConfig.join_image_color_circle)
        .addCircle(515, 155, 140)
        .addRoundImage(
          await buffer(data.displayAvatarURL({ format: 'png' })),
          390,
          30,
          252,
          252,
          126
        )
        .restore()
        .setTextAlign('center')
        .setShadowOffsetX(3)
        .setShadowOffsetY(3)
        .setShadowColor('rgba(0,0,0,0.3)')
        .setShadowBlur(6)
        .setColor(guildConfig.join_image_color_welcome)
        .setTextFont('50pt Discord')
        .addResponsiveText(`BIENVENUE`, 512, 375, 500)
        .setColor(guildConfig.join_image_color_message)
        .setTextFont('30pt Discord')
        .addResponsiveText(
          guildConfig.join_message
            .replace('{user}', member.user.username)
            .replace('{username}', member.user.username)
            .replace('{server}', member.guild),
          512,
          430,
          800
        )
        .setShadowOffsetX(3)
        .setShadowOffsetY(3)
        .setShadowColor('rgba(0,0,0,0.3)')
        .setShadowBlur(6)
        .toBuffer()
    }

    function buffer(data) {
      return axios
        .get(data, {
          responseType: 'arraybuffer',
        })
        .then((res) => res.data)
        .catch((err) => console.log(err))
    }
  }
}
