require('dotenv').config()
const sm = require('string-similarity')

module.exports = (client) => {
  client.userWarnsList = async (guild_id, user_id) => {
    try {
      const warns = await client.mysql.promiseRequest.query(
        'SELECT * FROM warns WHERE guild_id = ? AND user_id = ?',
        [guild_id, user_id]
      )
      return warns[0]
    } catch (error) {
      console.log('Une erreur est survenue : ' + error)
    }
  }

  client.setWarn = async (guild_id, user_id, by, reason) => {
    try {
      await client.mysql.promiseRequest.query('INSERT INTO warns SET ?', {
        guild_id,
        user_id,
        by,
        reason,
      })
    } catch (error) {
      console.log('Une erreur est survenue : ' + error)
    }
  }
  client.delWarn = async (number, guild_id, user_id) => {
    try {
      const warns = await client.mysql.promiseRequest.query(
        'SELECT * FROM warns WHERE guild_id = ? AND user_id = ?',
        [guild_id, user_id]
      )
      await client.mysql.promiseRequest.query('DELETE FROM warns WHERE ?', {
        id: warns[0][number].id,
      })
    } catch (error) {
      console.log('Une erreur est survenue : ' + error)
    }
  }
  client.clearWarns = async (guild_id, user_id) => {
    try {
      await client.mysql.promiseRequest.query(
        'DELETE FROM warns WHERE guild_id = ? AND user_id = ?',
        [guild_id, user_id]
      )
    } catch (error) {
      console.log('Une erreur est survenue : ' + error)
    }
  }
  client.checkWarn = async (number, guild_id, user_id) => {
    try {
      const warns = await client.mysql.promiseRequest.query(
        'SELECT * FROM warns WHERE guild_id = ? AND user_id = ?',
        [guild_id, user_id]
      )
      if (warns[0][number]) {
        return true
      } else {
        return false
      }
    } catch (error) {
      console.log('Une erreur est survenue : ' + error)
    }
  }
}
