const { Router } = require('express')
const router = Router()
const jwt = require('jsonwebtoken')

router.post('/getPlayer', verifyToken, async function (req, res, next) {
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
      if (!req.client.manager) {
        return res.status(400).json({
          error: 'Haru ne joue actuellement pas de musique.',
        })
      }
      const player = await req.client.manager.players.get(guild_id)
      const cloned = Object.assign({}, player)
      if (!cloned) {
        return res.status(400).json({
          error: 'Haru ne joue actuellement pas de musique.',
        })
      }
      delete cloned['node']
      return res.status(200).send(cloned)
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
