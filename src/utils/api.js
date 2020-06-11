const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const api = require('../api')

module.exports = (client) => {
  app.use(bodyParser.json())
  app.use(
    bodyParser.urlencoded({
      extended: false,
    })
  )
  app.use(function (req, res, next) {
    req.client = client
    next()
  })

  // Import API Routes
  app.use('/api', api)

  app.set('port', process.env.API_PORT || 3001)

  client.site = app.listen(app.get('port'), (err) => {
    if (err) throw err
    console.log(`API en ligne ! : ${app.get('port')}`)
  })
}
