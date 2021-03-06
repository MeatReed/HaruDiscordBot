const BaseEvent = require('../../utils/structures/BaseEvent')

module.exports = class ReadyEvent extends BaseEvent {
  constructor() {
    super('ready')
  }
  run(client) {
    const owner = client.getOwner()
    setInterval(function () {
      client.user.setActivity('h!help | By ' + owner.tag, {
        type: 'LISTENING',
      })
    }, 900000)
  }
}
