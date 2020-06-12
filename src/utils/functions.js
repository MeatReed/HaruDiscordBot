require('dotenv').config()
const sm = require('string-similarity')

module.exports = (client) => {
  client.fetchUser = (user, message) => {
    if (!message.guild.members.cache.get(user)) {
      let members = []
      let indexes = []

      message.guild.members.cache.forEach(function (member) {
        members.push(member.user.username)
        indexes.push(member.id)
      })

      let match = sm.findBestMatch(user, members)
      let username = match.bestMatch.target

      const member =
        message.mentions.members.first() ||
        message.guild.members.cache.get(indexes[members.indexOf(username)]) ||
        message.author

      let fetchedUser = ''
      if (!user) {
        fetchedUser = message.author
      } else {
        const mention = message.mentions.users.first()
        fetchedUser = mention || member.user
      }
      return fetchedUser
    } else {
      return message.guild.members.cache.get(user)
    }
  }

  client.fetchChannel = (search, message) => {
    if (!message.guild.channels.cache.get(search)) {
      let channels = []
      let indexes = []

      message.guild.channels.cache.forEach(function (channel) {
        channels.push(channel.name)
        indexes.push(channel.id)
      })

      const match = sm.findBestMatch(search, channels)
      const channelname = match.bestMatch.target

      const channel =
        message.mentions.channels.first() ||
        message.guild.channels.cache.get(
          indexes[channels.indexOf(channelname)]
        ) ||
        message.channel
      if (channel.type !== 'text') {
        client.ErrorEmbed(
          message,
          channel.name + " n'est pas un salon textuel !"
        )
        return
      }
      let fetchedChannel = ''
      if (!search) {
        fetchedChannel = message.channel
      } else {
        let mention = message.mentions.channels.first()
        fetchedChannel = mention || channel
      }
      return fetchedChannel
    } else {
      return message.guild.channels.cache.get(search)
    }
  }

  client.getOwner = () => {
    return client.users.cache.get(process.env.DISCORD_BOT_OWNER)
  }
}
