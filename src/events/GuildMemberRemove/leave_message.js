// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildMemberRemove
const BaseEvent = require('../../utils/structures/BaseEvent')
module.exports = class LeaveMessageEvent extends BaseEvent {
  constructor() {
    super('guildMemberRemove')
  }

  async run(client, member) {
    const guildConfig = await client.getGuild(member.guild.id)
    if (guildConfig.leave === 'on' && guildConfig.channel) {
      if (guildConfig.leave_image === 'on') return
      const channel = member.guild.channels.cache.get(guildConfig.channel)
      if (channel) {
        channel.send(
          guildConfig.leave_message
            .replace('{user}', member)
            .replace('{username}', member.user.username)
            .replace('{server}', member.guild)
        )
      }
    }
  }
}
