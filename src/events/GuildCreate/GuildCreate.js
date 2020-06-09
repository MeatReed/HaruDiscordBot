// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildCreate
const BaseEvent = require('../../utils/structures/BaseEvent')
module.exports = class GuildCreateEvent extends BaseEvent {
  constructor() {
    super('guildCreate')
  }

  run(client, guild) {
    client.createGuild(guild)
  }
}
