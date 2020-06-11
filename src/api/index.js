const express = require('express')

// Add USERS Routes
var router = express.Router()

var users = require('./controllers/users')
var bot = require('./controllers/bot')

router.use(users, bot)

module.exports = router
