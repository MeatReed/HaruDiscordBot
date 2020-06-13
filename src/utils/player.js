const fetch = require('node-fetch')
const { URLSearchParams } = require('url')
const { MessageCollector } = require('discord.js')
const moment = require('moment')

module.exports.getSongs = (player, search) => {
  const node = player.idealNodes[0]

  const params = new URLSearchParams()
  params.append('identifier', search)

  return fetch(`http://${node.host}:${node.port}/loadtracks?${params}`, {
    headers: { Authorization: node.password },
  })
    .then((res) => res.json())
    .then((data) => data.tracks)
    .catch((error) => {
      console.error(error)
      return null
    })
}

module.exports.getCurrentQueue = (queues, guildID) => {
  if (!queues[guildID]) {
    queues[guildID] = []
  }
  return queues[guildID]
}

function shuffle(array) {
  array.sort(() => Math.random() - 0.5)
}

module.exports.play = async (client, message, guild) => {
  try {
    let queue = await this.getCurrentQueue(client.queue.LAVALINK, guild.id)
    if (queue.length === 0) {
      client.manager.leave(guild.id)
      return
    }
    const player = client.manager.players.get(guild.id)

    if (!player.shuffle) {
      player.shuffle = false
    } else {
      shuffle(queue)
    }

    let currentTrack = queue[0]
    if (!player) {
      client.ErrorEmbed(
        message,
        "Le bot n'est pas connecté dans un salon vocal."
      )
      return
    }

    let duration = moment.duration({
      ms: currentTrack.info.duration,
    })
    message.channel.send({
      embed: {
        description: `<:true:644637367935959041> Joue : [${currentTrack.info.title}](${currentTrack.info.url}) !`,
        color: 16711717,
        timestamp: new Date(),
        thumbnail: {
          url: currentTrack.info.thumbnails,
        },
        fields: [
          {
            name: 'Auteur',
            value: currentTrack.info.author,
            inline: true,
          },
          {
            name: 'Durée de le musique',
            value: `${duration.minutes()}:${duration.seconds()}`,
            inline: true,
          },
          {
            name: 'Demandée par',
            value: currentTrack.author,
            inline: true,
          },
          {
            name: 'Boucle',
            value: currentTrack.loop === false ? 'Désactivée' : 'Activée',
            inline: true,
          },
          {
            name: 'Shuffle',
            value: player.shuffle === false ? 'Désactivée' : 'Activée',
            inline: true,
          },
        ],
      },
    })
    await player.play(currentTrack.track)
    player.once('error', (error) => {
      if (error) {
        client.ErrorEmbed(
          message,
          'Une erreur est survenue : \n```JS\n' + error.message + '```'
        )
        return
      }
    })
    player.once('end', async (data) => {
      if (data.reason === 'REPLACED') {
        return
      }
      if (!currentTrack.loop) {
        queue.shift()
      }
      if (data.reason === 'STOPPED' && queue.length === 0) {
        client.SuccesEmbed(message, "Il n'y a plus de musique dans la queue.")
      }
      await this.play(client, message, message.guild)
    })
  } catch (error) {
    if (error) {
      client.ErrorEmbed(
        message,
        'Une erreur est survenue : \n```JS\n' + error.message + '```'
      )
      return
    }
  }
}

module.exports.addToQueue = async (client, message, track) => {
  console.log(track)
  try {
    let queue = await this.getCurrentQueue(
      client.queue.LAVALINK,
      message.guild.id
    )

    if (
      track.startsWith('https://www.youtube.com/playlist?list=') ||
      track.startsWith('https://open.spotify.com/playlist/') ||
      track.startsWith('https://open.spotify.com/album/')
    ) {
      const songs = await this.getSongs(client.manager, track)

      if (!songs || !songs[0]) {
        client.ErrorEmbed(message, 'Aucun résultat trouvé.')
        return
      }
      let text
      for (let i = 0; i < songs.length; i++) {
        queue.push({
          track: songs[i].track,
          author: message.author.tag,
          loop: false,
          info: {
            identifier: songs[i].info.identifier,
            title: songs[i].info.title,
            duration: songs[i].info.length,
            author: songs[i].info.author,
            url: songs[i].info.uri,
            stream: songs[i].info.isStream,
            seekable: songs[i].info.isSeekable,
            thumbnails: `https://img.youtube.com/vi/${songs[i].info.identifier}/0.jpg`,
          },
        })
        let duration = moment.duration({
          ms: songs[i].info.length,
        })
        text += `${i} - [${songs[i].info.title}](${
          songs[i].info.uri
        })\nDurée : ${duration.minutes()}:${duration.seconds()} | Demandée par : ${
          message.author.tag
        }\n\n`
        if (text.length > 1900) {
          text = text.substr(0, 1900)
          text = text + '...'
        }
      }
      message.channel.send({
        embed: {
          title: 'Musique ajoutée',
          description: text,
          color: 16711717,
          author: {
            name: message.author.tag,
            icon_url: message.author.avatarURL,
          },
        },
      })
      await this.play(client, message, message.guild)
      return
    } else {
      const songs = await this.getSongs(client.manager, `ytsearch: ${track}`)
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
              queue.push({
                track: song.track,
                author: message.author.tag,
                loop: false,
                info: {
                  identifier: song.info.identifier,
                  title: song.info.title,
                  duration: song.info.length,
                  author: song.info.author,
                  url: song.info.uri,
                  stream: song.info.isStream,
                  seekable: song.info.isSeekable,
                  thumbnails: `https://img.youtube.com/vi/${song.info.identifier}/0.jpg`,
                },
              })
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
                        name: 'Durée de le musique',
                        value: `${duration.minutes()}:${duration.seconds()}`,
                        inline: true,
                      },
                      {
                        name: 'Demandée par',
                        value: message.author.tag,
                        inline: true,
                      },
                      /*{
                        name: 'Player via le site',
                        value: `http://${client.config.WEBSITE.DOMAINE}:${client.config.WEBSITE.PORT}/musique/${message.guild.id}`,
                        inline: true,
                      },*/
                    ],
                  },
                })
              }
              await this.play(client, message, message.guild)
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
        queue.push({
          track: song.track,
          author: message.author.tag,
          loop: false,
          info: {
            identifier: song.info.identifier,
            title: song.info.title,
            duration: song.info.length,
            author: song.info.author,
            url: song.info.uri,
            stream: song.info.isStream,
            seekable: song.info.isSeekable,
            thumbnails: `https://img.youtube.com/vi/${song.info.identifier}/0.jpg`,
          },
        })
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
                /*{
                  name: 'Player via le site',
                  value: `http://${client.config.WEBSITE.DOMAINE}:${client.config.WEBSITE.PORT}/musique/${message.guild.id}`,
                  inline: true,
                },*/
              ],
            },
          })
          return
        }
        await this.play(client, message, message.guild)
        return
      }
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
