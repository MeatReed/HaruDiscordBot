const { MessageCollector } = require('discord.js')
const moment = require('moment')
const ytdl = require('ytdl-core')
const readline = require('readline')
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg')
const ffmpeg = require('fluent-ffmpeg')
ffmpeg.setFfmpegPath(ffmpegInstaller.path)

module.exports.convert = async (client, message) => {
  try {
    let queue = await client.music.getCurrentQueue(
      client.queue.YTDL,
      message.guild.id
    )

    if (queue.length === 0) {
      return
    }

    const currentSong = queue[0].info

    const loading = await message.channel.send(
      '<a:loading:644636255006490640> Conversion en cours..'
    )

    const identifier = currentSong.uri

    const stream = ytdl(identifier, {
      format: 'mp3',
      audioonly: true,
      quality: 'highestaudio',
    })

    const start = Date.now()

    const info = await ytdl.getInfo(identifier)

    const videoDetails = info.player_response.videoDetails

    const videoTitle = videoDetails.title
    let artist = 'Inconnu'
    let title = 'Inconnu'

    if (videoTitle.indexOf('-') > -1) {
      var temp = videoTitle.split('-')
      if (temp.length >= 2) {
        artist = temp[0].trim()
        title = temp[1].trim()
      }
    } else {
      title = videoTitle
    }

    /*var outputOptions = [
          '-id3v2_version',
          '4',
          '-metadata',
          'title=' + title,
          '-metadata',
          'album=YouTube',
          '-metadata',
          'artist=' + artist,
        ]*/

    const nameSave = `${Date.now()}-${message.author.id}`
    ffmpeg(stream)
      .format('mp3')
      .save(`./mp3/${nameSave}.mp3`)
      .on('error', function (err) {
        console.log(err)
        client.ErrorEmbed(
          message,
          'Une erreur est survenue : \n```JS\n' + err.message + '```'
        )
        queue.shift()

        this.convert(client, message)
        return
      })
      .on('progress', (p) => {
        readline.cursorTo(process.stdout, 0)
        process.stdout.write(`${p.targetSize}kb downloaded`)
      })
      .on('end', async () => {
        await loading.delete()
        console.log(`\ndone, thanks - ${(Date.now() - start) / 1000}s`)

        message.channel.send(
          '[' +
            (Date.now() - start) / 1000 +
            's] Voici le fichier mp3 de la vidéo Youtube `' +
            title +
            '` : http://' +
            process.env.WEB_IP +
            ':' +
            process.env.WEB_PORT +
            '/api/mp3/' +
            videoDetails.videoId +
            '/' +
            `${nameSave}`
        )

        queue.shift()

        this.convert(client, message)
      })
  } catch (exception) {
    if (exception) {
      client.ErrorEmbed(
        message,
        'Une erreur est survenue : \n```JS\n' + exception.message + '```'
      )
      console.log(exception)
      return
    }
  }
}

module.exports.addToQueue = async (client, message, track) => {
  try {
    let queue = await client.music.getCurrentQueue(
      client.queue.YTDL,
      message.guild.id
    )
    const songs = await client.music.getSongs(
      client.manager,
      `ytsearch: ${track}`
    )
    if (!songs) {
      client.ErrorEmbed(message, 'Aucun résultat trouvé.')
      return
    }

    if (songs.length > 1) {
      let msg = songs
        .slice(0, 9)
        .map(
          (s, i) =>
            '**' + (i + 1) + '** - [' + s.info.title + '](' + s.info.uri + ')'
        )
        .join('\n')

      msg +=
        '\n\nChoisissez votre musique qui correspond à votre recherche ou tapez `annuler` pour annuler la recherche.'

      message.channel
        .send({
          embed: {
            description: msg,
            color: 16711717,
          },
        })
        .then((m) => {
          const filter = (m) => m.author.id === message.author.id
          const collector = new MessageCollector(message.channel, filter, {
            time: 20000,
          })
          collector.on('collect', async (msgCollected) => {
            const choice = msgCollected.content.split(' ')[0]
            if (choice.toLowerCase() === 'annuler') {
              collector.stop('STOPPED')
              return
            }
            if (!choice || isNaN(choice)) {
              client.ErrorEmbed(message, 'Choix invalide !')
              return
            }
            if (choice > songs.length || choice <= 0) {
              client.ErrorEmbed(message, 'Choix invalide !')
              return
            }
            const song = songs[choice - 1]
            collector.stop('PLAY')
            m.delete()
            msgCollected.delete()
            queue.push(song)
            if (queue.length > 1) {
              const duration = moment.duration({
                ms: song.info.length,
              })
              return message.channel.send({
                embed: {
                  description: `<:true:644637367935959041> [${song.info.title}](${song.info.uri}) ajoutée dans la queue !`,
                  color: 16711717,
                  timestamp: new Date(),
                  thumbnail: {
                    url: `https://img.youtube.com/vi/${song.info.identifier}/0.jpg`,
                  },
                  fields: [
                    {
                      name: 'Auteur',
                      value: `${song.info.author}`,
                      inline: true,
                    },
                    {
                      name: 'Durée',
                      value: `${duration.minutes()}:${duration.seconds()}`,
                      inline: true,
                    },
                    {
                      name: 'Demandée par',
                      value: message.author.tag,
                      inline: true,
                    },
                  ],
                },
              })
            }
            await this.convert(client, message)
            return
          })
          collector.on('end', (collected, reason) => {
            if (reason === 'STOPPED') {
              client.SuccesEmbed(message, 'Vous avez annulé !')
              return
            } else if (reason === 'PLAY') {
              return
            } else {
              client.ErrorEmbed(
                message,
                'Vous avez mis beaucoup trop de temps pour choisir !'
              )
              return
            }
          })
        })
        .catch((err) => {
          if (err) {
            client.ErrorEmbed(
              message,
              'Une erreur est survenue : \n```JS\n' + err.message + '```'
            )
            console.log(err)
            return
          }
        })
    } else {
      const song = songs[0]
      if (!song) {
        client.ErrorEmbed(message, 'Aucun résultat trouvé.')
        return
      }
      queue.push(song)
      if (queue.length > 1) {
        const duration = moment.duration({
          ms: song.info.duration,
        })
        message.channel.send({
          embed: {
            description: `<:true:644637367935959041> [${song.info.title}](${song.info.url}) ajoutée dans la queue !`,
            color: 16711717,
            timestamp: new Date(),
            thumbnail: {
              url: `https://img.youtube.com/vi/${song.info.identifier}/0.jpg`,
            },
            fields: [
              {
                name: 'Auteur',
                value: `${song.info.author}`,
                inline: true,
              },
              {
                name: 'Durée de le musique',
                value: `${duration.minutes()}:${duration.seconds()}`,
                inline: true,
              },
              {
                name: 'Demandée par',
                value: message.author.tag,
                inline: true,
              },
            ],
          },
        })
        return
      }
      await this.convert(client, message)
      return
    }
  } catch (error) {
    if (error) {
      console.log(error)
      client.ErrorEmbed(
        message,
        'Une erreur est survenue : \n```JS\n' + error.message + '```'
      )
      return
    }
  }
}
