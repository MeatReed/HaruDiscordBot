const sm = require('string-similarity')

module.exports = (client) => {
  client.SuccesEmbed = async (message, msg) => {
    message.channel.send({
      embed: {
        description: '<:true:644637367935959041> ' + msg,
        color: 65349,
      },
    })
  }

  client.ErrorEmbed = async (message, msg) => {
    message.channel.send({
      embed: {
        description: '<:false:644637633389264896> ' + msg,
        color: 16711717,
      },
    })
  }
}
