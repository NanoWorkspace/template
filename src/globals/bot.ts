import Discord from "discord.js"
import Logger from "../app/Logger"
import { EmbedTemplates } from "../app/Embed"

Logger.load("file", __filename)

export interface NanoConfig {
  prefix: string
  token?: string
  clientOptions?: Discord.ClientOptions
  embedTemplates?: EmbedTemplates
}

export interface Bot extends Partial<Discord.ClientApplication>, NanoConfig {
  team?: Discord.Team
  owners: Discord.Collection<Discord.Snowflake, Discord.User>
}

const bot: Bot = require("../../nano.config.json")

bot.owners = new Discord.Collection()

export default bot
module.exports = bot
