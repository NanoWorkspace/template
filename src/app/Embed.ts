const { bot } = require("../../package.json")

import Discord from "discord.js"

interface EmbedOptions extends Discord.MessageEmbedOptions {
  errorTitle: string
  successTitle: string
}

export default class Embed extends Discord.MessageEmbed {
  constructor() {
    super(bot.embedOptions)
  }

  setSuccess(text: string): Embed {
    return this.setTitle(bot.embedOptions.successTitle).setDescription(text)
  }

  setError(text: string): Embed {
    return this.setTitle(bot.embedOptions.errorTitle).setDescription(text)
  }
}
