const BaseEvent = require('../../utils/structures/BaseEvent')

module.exports = class CommandMessageEvent extends BaseEvent {
  constructor() {
    super('message')
  }

  run(client, message) {
    if (message.author.bot) return
    if (message.content.startsWith(client.prefix)) {
      const [cmdName, ...cmdArgs] = message.content
        .slice(client.prefix.length)
        .trim()
        .split(/\s+/)
      const command = client.commands.get(cmdName)
      if (command) {
        if (command.enabled === false) {
          client.ErrorEmbed(
            message,
            'Cette commande a été temporairement désactivée !'
          )
        } else if (
          command.guildOnly === true &&
          message.channel.type === 'dm'
        ) {
          client.ErrorEmbed(
            message,
            "Cette commande n'est disponible que pour les serveurs !"
          )
        } else if (
          command.nsfw === true &&
          message.channel.nsfw === false &&
          message.channel.type === 'text'
        ) {
          client.ErrorEmbed(
            message,
            'Pour effectuer cette commande le NSFW doit être activé !'
          )
        } else if (!message.guild.me.hasPermission(command.clientPermissions)) {
          client.ErrorEmbed(
            message,
            `Pour effectuer cette commande, Haru doit obtenir la/les permission(s) : \`${command.clientPermissions.join(
              ' '
            )}\``
          )
        } else if (!message.member.hasPermission(command.userPermissions)) {
          client.ErrorEmbed(
            message,
            `Pour effectuer cette commande, vous devez obtenir la/les permission(s) : \`${command.userPermissions.join(
              ' '
            )}\``
          )
        } else if (!client.manager && command.category === '🎸 Musique') {
          client.ErrorEmbed(
            message,
            `Le serveur Lavalink n'a pas encore démarré, veuillez patienter 30 secondes puis réessayer.`
          )
        } else {
          command.run(client, message, cmdArgs, command)
        }
      }
    }
  }
}
