module.exports = class BaseCommand {
  constructor(
    {
      name = null,
      description = 'Aucune description détectée.',
      category = null,
      usage = 'Aucune utilisation détectée.',
      enabled = true,
      guildOnly = false,
      nsfw = false,
      aliases = new Array(),
    }
  )
  {
    this.name = name;
    this.description = description;
    this.category = category;
    this.usage = usage;
    this.enabled = enabled;
    this.guildOnly = guildOnly;
    this.nsfw = nsfw;
    this.aliases = aliases;
  }
}