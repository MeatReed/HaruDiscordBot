const { Router } = require('express')
const botModel = require('../models/bot')
const router = Router()

router.get('/botinfo', function (req, res, next) {
  botModel.botinfo(req, (err, data) => {
    res.status(200).json(data)
  })
})

module.exports = router
