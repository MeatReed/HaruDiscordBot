// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildDelete
const BaseEvent = require('../utils/structures/BaseEvent')
module.exports = class GuildDeleteEvent extends BaseEvent {
  constructor() {
    super('guildDelete')
  }

  run(client, guild) {
    client.deleteGuild(guild)
  }
}
