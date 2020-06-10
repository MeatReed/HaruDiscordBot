// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildMemberRemove
const BaseEvent = require('../../utils/structures/BaseEvent')
module.exports = class JoinMessageEvent extends BaseEvent {
  constructor() {
    super('guildMemberAdd')
  }

  async run(client, member) {
    const guildConfig = await client.getGuild(member.guild.id)
    if (guildConfig.join === 'on' && guildConfig.channel) {
      if (guildConfig.join_image === 'on') return
      const channel = member.guild.channels.cache.get(guildConfig.channel)
      if (channel) {
        channel.send(
          guildConfig.join_message
            .replace('{user}', member)
            .replace('{username}', member.user.username)
            .replace('{server}', member.guild)
        )
      }
    }
  }
}
