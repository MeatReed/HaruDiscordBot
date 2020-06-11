const BaseCommand = require('../../utils/structures/BaseCommand')
const Discord = require('discord.js')

module.exports = class HelpCommand extends BaseCommand {
  constructor() {
    super({
      name: 'help',
      description: '',
      category: 'Misc',
      usage: 'help {commande}',
      enabled: true,
      guildOnly: true,
      nsfw: false,
      aliases: [],
      userPermissions: [],
      clientPermissions: [],
    })
  }

  async run(client, message, args) {
    try {
      const ownerUser = client.getOwner()
      if (!args[0]) {
        let output = `Utilisez \`${client.prefix}help {nom de la commande}\` pour plus de détails sur une commande\n[] = Obligatoire\n{} = Non obligatoire\n\n`

        const Embed = new Discord.MessageEmbed()
          .setColor('0xb1072e')
          .setTitle('Liste des commandes disponibles')
          .setDescription(output)
          .setThumbnail(client.user.avatarURL())
          .setAuthor(
            `${ownerUser.tag}`,
            ownerUser.avatarURL() || ownerUser.defaultAvatarURL
          )
          .setTimestamp()
          .setFooter(
            'Demandée par ' + message.author.tag,
            message.author.avatarURL
          )

        const help = {}

        client.commands.forEach((command) => {
          const cat = command.category

          if (cat === 'dev') return

          if (!help.hasOwnProperty(cat)) help[cat] = []

          help[cat].push(command)
        })

        for (const category in help) {
          let categoryEmbed

          categoryEmbed = category

          let cmd = ''

          for (const command of help[category]) {
            cmd += '`' + client.prefix + command.name + '`, '
          }

          Embed.addField(categoryEmbed, cmd)
        }

        Embed.addField(
          'Liens utiles',
          '[Invitation du bot](https://discord.com/api/oauth2/authorize?client_id=718193235373326346&permissions=1609887095&scope=bot)'
        )

        message.channel.send(Embed)
      } else {
        let command = args[0]

        if (client.commands.has(command)) {
          command = client.commands.get(command)
          const EmbedHelp = new Discord.MessageEmbed()
            .setColor('0xb1072e')
            .setTitle('Utilisation de la commande ' + command.name)
            .setThumbnail(client.user.avatarURL())
            .setAuthor(
              `${ownerUser.tag}`,
              ownerUser.avatarURL() || ownerUser.defaultAvatarURL
            )
            .setTimestamp()
            .setFooter(
              'Demandée par ' + message.author.tag,
              message.author.avatarURL
            )
            .addField(
              'Description :',
              command.description || 'Ne possède pas de description.'
            )
            .addField('Utilisation :', client.prefix + command.usage)
            .addField(
              'Alias :',
              command.aliases[0]
                ? client.prefix + command.aliases.join(', ')
                : "Ne possède pas d'alias."
            )
          message.channel.send(EmbedHelp)
        }
      }
    } catch (error) {
      client.ErrorEmbed(
        message,
        'Une erreur est survenue : \n```JS\n' + error.message + '```'
      )
    }
  }
}
