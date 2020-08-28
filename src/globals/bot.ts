import Discord from "discord.js"
import Logger from "../app/Logger"
import { EmbedTemplates } from "../app/Embed"

Logger.load("file", __filename)

// todo: nano.config.ts

export interface Bot extends Partial<Discord.ClientApplication> {
  prefix: string
  team?: Discord.Team
  clientOptions: Discord.ClientOptions
  embedTemplates: EmbedTemplates
}

const bot: Bot = require("../../package.json").bot

export default bot
module.exports = bot
