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

  client.setWarn = async (message, guild_id, user_id, by, reason) => {
    try {
      await client.mysql.promiseRequest.query('INSERT INTO warns SET ?', {
        guild_id,
        user_id,
        by,
        reason,
        created_at: new Date(),
      })
      const warns = await client.userWarnsList(guild_id, user_id)
      const sanctionsDB = await client.getSanction(guild_id, warns.length)
      const member = message.guild.members.cache.get(user_id)
      const guildConfig = await client.getGuild(guild_id)
      if (guildConfig.warnDM === 'on') {
        member.send(
          `Vous avez été averti dans le serveur \`${message.guild.name}\`.`
        )
      }
      if (sanctionsDB[0]) {
        for (const sanctionIndex in sanctionsDB) {
          if (sanctionsDB[sanctionIndex].sanction === 'mute') {
            let muteRole = message.guild.roles.cache.find(
              (r) => r.name === 'muted'
            )
            if (!muteRole) {
              muteRole = await message.guild.roles.create({
                data: {
                  name: 'muted',
                  color: '#000',
                  permissions: [],
                },
              })
              message.guild.channels.cache.forEach(async (channel) => {
                await channel.updateOverwrite(muteRole, {
                  SEND_MESSAGES: false,
                  ADD_REACTIONS: false,
                  CONNECT: false,
                })
              })
            }
            await member.roles
              .add(muteRole.id)
              .then((usr) => {
                client.SuccesEmbed(
                  message,
                  `L'utilisateur <@${user_id}> a été réduit au silence.`
                )
              })
              .catch((error) => {
                client.ErrorEmbed(
                  message,
                  `Impossible de mettre le rôle \`muted\` à <@${user_id}>`
                )
              })
          } else if (sanctionsDB[sanctionIndex].sanction === 'kick') {
            message.guild.members.cache
              .get(user_id)
              .kick({
                reason: 'Expulser automatiquement.',
              })
              .then((usr) => {
                client.SuccesEmbed(
                  message,
                  `L'utilisateur <@${user_id}> a été expulsé.`
                )
              })
              .catch((error) => {
                client.ErrorEmbed(
                  message,
                  'Impossible de expulser cet utilisateur !'
                )
              })
          } else if (sanctionsDB[sanctionIndex].sanction === 'ban') {
            message.guild.members
              .ban(user_id, {
                reason: 'Expulser automatiquement.',
              })
              .then((usr) => {
                client.SuccesEmbed(
                  message,
                  `L'utilisateur <@${user_id}> a été banni.`
                )
              })
              .catch((error) => {
                client.ErrorEmbed(
                  message,
                  'Impossible de bannir cet utilisateur !'
                )
              })
          }
        }
      } else {
        console.log('no sanction')
      }
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

  client.setSanction = async (guild_id, warnAmount, sanction) => {
    try {
      await client.mysql.promiseRequest.query(
        'INSERT INTO warnsettings SET ?',
        {
          guild_id,
          warnAmount,
          sanction,
        }
      )
    } catch (error) {
      console.log('Une erreur est survenue : ' + error)
    }
  }

  client.delSanction = async (guild_id, sanction) => {
    try {
      await client.mysql.promiseRequest.query(
        'DELETE FROM warnsettings WHERE guild_id = ? and sanction = ?',
        [guild_id, sanction]
      )
    } catch (error) {
      console.log('Une erreur est survenue : ' + error)
    }
  }

  client.getSanctions = async (guild_id) => {
    try {
      const sanctions = await client.mysql.promiseRequest.query(
        'SELECT * FROM warnsettings WHERE guild_id = ?',
        [guild_id]
      )
      if (sanctions[0][0]) {
        return sanctions[0]
      } else {
        return false
      }
    } catch (error) {
      console.log('Une erreur est survenue : ' + error)
    }
  }

  client.getSanction = async (guild_id, warnAmount) => {
    try {
      const sanctionDB = await client.mysql.promiseRequest.query(
        'SELECT * FROM warnsettings WHERE guild_id = ? AND warnAmount = ?',
        [guild_id, warnAmount]
      )
      if (sanctionDB[0][0]) {
        return sanctionDB[0]
      } else {
        return false
      }
    } catch (error) {
      console.log('Une erreur est survenue : ' + error)
    }
  }

  client.getSanctionWithSanction = async (guild_id, sanction) => {
    try {
      const sanctionDB = await client.mysql.promiseRequest.query(
        'SELECT * FROM warnsettings WHERE guild_id = ? AND sanction = ?',
        [guild_id, sanction]
      )
      if (sanctionDB[0][0]) {
        return sanctionDB[0][0]
      } else {
        return false
      }
    } catch (error) {
      console.log('Une erreur est survenue : ' + error)
    }
  }
}
