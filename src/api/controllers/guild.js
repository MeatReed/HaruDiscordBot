const { Router } = require('express')
const router = Router()
const jwt = require('jsonwebtoken')

router.post('/getGuildConfig/', verifyToken, async function (req, res, next) {
  jwt.verify(req.token, process.env.API_SECRET, async (err, decode) => {
    if (err) {
      return res.status(400)
    }
    const guild_id = req.body.guild_id
    if (guild_id) {
      const guild = req.client.guilds.cache.get(guild_id)
      if (!guild) {
        return res.status(400).json({
          error: 'Une erreur est survenue.',
        })
      }
      const member = guild.members.cache.get(decode.id)
      if (!member) {
        return res.status(400).json({
          error: 'Une erreur est survenue.',
        })
      }
      const guildConfig = await req.client.getGuild(guild_id)
      if (guildConfig && member.hasPermission(2146958591)) {
        return res.status(200).json(guildConfig)
      } else {
        return res.status(400).json({
          error: 'Une erreur est survenue.',
        })
      }
    } else {
      return res.status(400).json({
        error: 'Une erreur est survenue.',
      })
    }
  })
})

router.post('/setGuildConfig', verifyToken, async function (req, res, next) {
  jwt.verify(req.token, process.env.API_SECRET, async (err, decode) => {
    if (err) {
      return res.status(400).json({
        error: 'Une erreur est survenue.',
      })
    }
    const guild_id = req.body.guild_id
    const data = req.body.data
    if (guild_id) {
      const guild = req.client.guilds.cache.get(guild_id)
      if (!guild) {
        return res.status(400).json({
          error: 'Une erreur est survenue.',
        })
      }
      const member = guild.members.cache.get(decode.id)
      if (!member) {
        return res.status(400).json({
          error: 'Une erreur est survenue.',
        })
      }
      const guildConfig = await req.client.getGuild(guild_id)
      if (guildConfig && member.hasPermission(2146958591)) {
        req.client.updateGuild(guild_id, data)
        return res.status(200).send(data)
      } else {
        return res.status(400).json({
          error: 'Une erreur est survenue.',
        })
      }
    } else {
      return res.status(400).json({
        error: 'Une erreur est survenue.',
      })
    }
  })
})

router.post('/getChannel', verifyToken, async function (req, res, next) {
  jwt.verify(req.token, process.env.API_SECRET, async (err, decode) => {
    if (err) {
      return res.status(400).json({
        error: 'Une erreur est survenue.',
      })
    }
    const guild_id = req.body.guild_id
    const channel_id = req.body.channel_id
    if (channel_id && guild_id) {
      const guild = req.client.guilds.cache.get(guild_id)
      if (!guild) {
        return res.status(400).json({
          error: 'Une erreur est survenue.',
        })
      }
      const channel = guild.channels.cache.get(channel_id)
      if (!channel) {
        return res.status(400).json({
          error: 'Une erreur est survenue.',
        })
      }
      return res.status(200).send(channel)
    } else {
      return res.status(400).json({
        error: 'Une erreur est survenue.',
      })
    }
  })
})

router.post('/getChannels', verifyToken, async function (req, res, next) {
  jwt.verify(req.token, process.env.API_SECRET, async (err, decode) => {
    if (err) {
      return res.status(400).json({
        error: 'Une erreur est survenue.',
      })
    }
    const guild_id = req.body.guild_id
    if (guild_id) {
      const guild = req.client.guilds.cache.get(guild_id)
      if (!guild) {
        return res.status(400).json({
          error: 'Une erreur est survenue.',
        })
      }
      const channel = guild.channels.cache
        .filter((c) => c.type === 'text')
        .filter((c) => c.permissionsFor(req.client.user).has('SEND_MESSAGES'))
      if (!channel) {
        return res.status(400).json({
          error: 'Une erreur est survenue.',
        })
      }
      return res.status(200).send(channel)
    } else {
      return res.status(400).json({
        error: 'Une erreur est survenue.',
      })
    }
  })
})

function verifyToken(req, res, next) {
  const bearerHeader = req.headers.authorization

  if (typeof bearerHeader !== 'undefined') {
    req.token = bearerHeader
    next()
  } else {
    return res.status(400).json({
      error: 'Accès refusé !',
    })
  }
}

module.exports = router
