const sm = require('string-similarity')

module.exports = (client) => {
  client.createGuild = async (guild) => {
    try {
      await client.mysql.promiseRequest.query('INSERT INTO guilds SET ?', {
        guild_id: guild.id,
      })
      console.log(`Nouveau serveur : ${guild.name}(${guild.id})`)
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

  client.getGuild = async (guild) => {
    try {
      const requestGuild = await client.mysql.promiseRequest.query(
        'SELECT * FROM guilds WHERE ?',
        {
          guild_id: guild.id,
        }
      )
      return requestGuild[0]
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
}
