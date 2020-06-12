const { Router } = require('express')
const botModel = require('../models/bot')
const router = Router()
const jwt = require('jsonwebtoken')

router.get('/botinfo', function (req, res, next) {
  botModel.botinfo(req, (err, data) => {
    res.status(200).json(data)
  })
})

router.get('/commands', function (req, res, next) {
  let help = {}
  let commands = []
  req.client.commands.forEach((command) => {
    const cat = command.category

    if (cat === 'dev') return

    if (!help.hasOwnProperty(cat)) help[cat] = []

    help[cat].push(command)
  })

  for (const category in help) {
    let categoryEmbed

    categoryEmbed = category

    let cmd = []

    for (const command of help[category]) {
      cmd.push(command)
    }

    commands.push({ category, cmd })
  }
  res.status(200).json(commands)
})

module.exports = router
