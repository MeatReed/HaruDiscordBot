const express = require('express')

// Add USERS Routes
var router = express.Router()

var users = require('./controllers/users')
var bot = require('./controllers/bot')
var guild = require('./controllers/guild')

router.use(users, bot, guild)

module.exports = router
