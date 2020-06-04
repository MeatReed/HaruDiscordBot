module.exports = client => {
  client.createGuild = async guild => {
    try {
      await client.mysql.promiseRequest.query('INSERT INTO guilds SET ?', {
        guild_id: guild.id
      })
      console.log(`Nouveau serveur : ${guild.name}(${guild.id})`)
    } catch (error) {
      console.log('Une erreur est survenue : ' + error)
    }
  }

  client.deleteGuild = async guild => {
    try {
      await client.mysql.promiseRequest.query('DELETE FROM guilds WHERE ?', {
        guild_id: guild.id
      })
      console.log(`Suppresion serveur : ${guild.name}(${guild.id})`)
    } catch (error) {
      console.log('Une erreur est survenue : ' + error)
    }
  }

  client.getGuild = async guild => {
    try {
      const requestGuild = await client.mysql.promiseRequest.query('SELECT * FROM guilds WHERE ?', {
        guild_id: guild.id
      })
      return requestGuild[0]
    } catch (error) {
      console.log('Une erreur est survenue : ' + error)
    }
  }
}