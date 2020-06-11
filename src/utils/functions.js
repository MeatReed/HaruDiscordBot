require('dotenv').config()
const sm = require('string-similarity')

module.exports = (client) => {
  client.createGuild = async (guild) => {
    try {
      await client.mysql.promiseRequest.query('INSERT INTO guilds SET ?', {
        guild_id: guild.id,
        join_message: 'Bienvenue {user} dans le serveur {server} !',
        join_image_url: 'https://images8.alphacoders.com/108/1081308.png',
        join_image_message: 'Bienvenue {user} dans le serveur {server} !',
        leave_message: '{user} a quitté le serveur.',
        leave_image_url:
          'https://images3.alphacoders.com/105/thumb-1920-1058494.jpg',
        leave_image_message: '{user} a quitté le serveur.',
      })
      console.log(`Nouveau serveur : ${guild.name}(${guild.id})`)
    } catch (error) {
      console.log('Une erreur est survenue : ' + error)
    }
  }

  client.updateGuild = async (guild_id, data) => {
    try {
      await client.mysql.promiseRequest.query(
        `UPDATE guilds SET ? WHERE guild_id = '${guild_id}'`,
        data
      )
    } catch (error) {
      console.log('Une erreur est survenue : ' + error)
    }
  }

  client.deleteGuild = async (guild) => {
    try {
      await client.mysql.promiseRequest.query('DELETE FROM guilds WHERE ?', {
        guild_id: guild.id,
      })
      console.log(`Suppresion serveur : ${guild.name}(${guild.id})`)
    } catch (error) {
      console.log('Une erreur est survenue : ' + error)
    }
  }

  client.getGuild = async (guild_id) => {
    try {
      const requestGuild = await client.mysql.promiseRequest.query(
        'SELECT * FROM guilds WHERE ?',
        {
          guild_id,
        }
      )
      return requestGuild[0][0]
    } catch (error) {
      console.log('Une erreur est survenue : ' + error)
    }
  }

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
