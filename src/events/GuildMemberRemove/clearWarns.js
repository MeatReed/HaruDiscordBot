// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildMemberRemove
const BaseEvent = require('../../utils/structures/BaseEvent')
module.exports = class ClearWarnEvent extends BaseEvent {
  constructor() {
    super('guildMemberRemove')
  }

  async run(client, member) {
    await client.clearWarns(member.guild.id, member.id)
  }
}
