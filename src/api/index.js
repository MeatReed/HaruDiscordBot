const express = require('express')

// Add USERS Routes
var router = express.Router()

var users = require('./controllers/users')
var bot = require('./controllers/bot')
var guild = require('./controllers/guild')
var player = require('./controllers/player')
var ytdl = require('./controllers/ytdl')

router.use(users, bot, guild, player, ytdl)

module.exports = router
