import Enmap from "enmap"
import Discord from "discord.js"
import Logger from "../app/Logger"
import bot from "./bot"
import { ReactionRoleMessageOptions } from "../app/ReactionRoleMessage"

Logger.load("file", __filename)

interface GuildData {
  prefix: string
  moderatorRole?: Discord.Snowflake
  logChannel?: Discord.Snowflake
  ignoredChannels: Discord.Snowflake[]
  ignoredUser: Discord.Snowflake[]
  autoRoles: {
    user: Discord.Snowflake[]
    bot: Discord.Snowflake[]
  }
  authorizedTwitterUsers: string[]
  reactionRoleMessages: { [k: string]: ReactionRoleMessageOptions }
}

class Database extends Enmap {
  constructor() {
    super({ name: "db" })
  }

  ensureGuild(guild: Discord.Guild) {
    const data: GuildData = {
      prefix: bot.prefix,
      ignoredChannels: [],
      ignoredUser: [],
      autoRoles: {
        user: [],
        bot: [],
      },
      authorizedTwitterUsers: [],
      reactionRoleMessages: {},
    }
    this.ensure(guild.id, data)
  }

  getGuild(guild: Discord.Guild): GuildData {
    return this.get(guild.id)
  }
}

/** The Enmap database of bot system */
const db = new Database()

export default db
module.exports = db
