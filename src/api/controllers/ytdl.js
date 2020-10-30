const { Router } = require('express')
const router = Router()
const path = require('path')
const ytdl = require('ytdl-core')

router.get('/mp3/:songIdentifier/:songTitle', async function (req, res, next) {
  let info = await ytdl.getInfo(req.params.songIdentifier)

  const file = req.params.songTitle

  const fileLocation = path.join('./mp3', file + '.mp3')

  if (!fileLocation) {
    return res.status(404).json({
      err: 'Musique introuvable',
    })
  } else {
    info = info.player_response.videoDetails

    const videoTitle = info.title

    res.download(fileLocation, videoTitle + '.mp3')
  }
})

module.exports = router
