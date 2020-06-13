const { Router } = require('express')
const router = Router()
const path = require('path')
const ytdl = require('ytdl-core')

router.get('/mp3/:songIdentifier/:songTitle', async function (req, res, next) {
  ytdl.getInfo(req.params.songIdentifier, (err, info) => {
    if (err) {
      return res.status(404).json({
        err: 'songIdentifier incorrect',
      })
    } else {
      let file = req.params.songTitle

      var fileLocation = path.join('./mp3', file + '.mp3')

      if (!fileLocation) {
        return res.status(404).json({
          err: 'Musique introuvable',
        })
      } else {
        info = info.player_response.videoDetails

        const videoTitle = info.title

        res.download(fileLocation, videoTitle + '.mp3')
      }
    }
  })
})

module.exports = router
