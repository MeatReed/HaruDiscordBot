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
}
