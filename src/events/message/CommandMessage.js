const BaseEvent = require('../../utils/structures/BaseEvent');

module.exports = class CommandMessageEvent extends BaseEvent {
  constructor() {
    super('message');
  }
  
  async run(client, message) {
    if (message.author.bot) return;
    if (message.content.startsWith(client.prefix)) {
      const [cmdName, ...cmdArgs] = message.content
        .slice(client.prefix.length)
        .trim()
        .split(/\s+/);
      const command = client.commands.get(cmdName);
      if (command) {
        if(command.enabled === false) {
          message.reply('cette commande a été temporairement désactivée !')
        } else if(command.guildOnly === true && message.channel.type === 'dm') {
          message.reply('cette commande n\'est disponible que pour les serveurs !')
        } else if(command.nsfw === true && message.channel.nsfw === false && message.channel.type === 'text') {
          message.reply('pour effectuer cette commande le NSFW doit être activé !')
        } else if(!message.guild.me.hasPermission(command.clientPermissions)) {
          message.reply(`pour effectuer cette commande, Haru doit obtenir la/les permission(s) : \`${command.clientPermissions.join(' ')}\``)
        } else if (!message.member.hasPermission(command.userPermissions)) {
          message.reply(`pour effectuer cette commande, vous devez obtenir la/les permission(s) : \`${command.userPermissions.join(' ')}\``)
        } else {
          command.run(client, message, cmdArgs, command)
        }
      }
    }
  }
}
