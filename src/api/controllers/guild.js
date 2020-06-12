const { Router } = require('express')
const botModel = require('../models/bot')
const router = Router()
const jwt = require('jsonwebtoken')

router.post('/getGuildConfig/', async function (req, res, next) {
  const guild_id = req.body.guild_id
  if (guild_id) {
    const guildConfig = await req.client.getGuild(guild_id)
    if (guildConfig) {
      res.status(200).json(guildConfig)
    } else {
      res.status(200).send(null)
    }
  } else {
    res.status(200).send(null)
  }
})

module.exports = router
