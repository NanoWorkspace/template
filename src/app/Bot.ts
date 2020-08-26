import Discord from "discord.js"
import Logger from "./Logger"

Logger.load("file", __filename)

export interface EmbedTemplates {
  default: Discord.MessageEmbedOptions
  [k: string]: Discord.MessageEmbedOptions
}

export interface Bot extends Partial<Discord.ClientApplication> {
  prefix: string
  team?: Discord.Team
  clientOptions: Discord.ClientOptions
  embedTemplates: EmbedTemplates
}

const bot: Bot = require("../../package.json").bot

export default bot
module.exports = bot
