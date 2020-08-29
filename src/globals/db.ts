import Enmap from "enmap"
import Discord from "discord.js"
import Logger from "../app/Logger"
import bot from "./bot"
import { ReactionRoleMessageOptions } from "../app/ReactionRoleMessage"

Logger.load("file", __filename)

interface GuildData {
  prefix: string
  moderatorRoleID?: Discord.Snowflake
  logChannelID?: Discord.Snowflake
  moderatorRole?: Discord.Role
  logChannel?: Discord.TextChannel
  ignoredChannels: Discord.Snowflake[]
  ignoredUsers: Discord.Snowflake[]
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
      ignoredUsers: [],
      autoRoles: {
        user: [],
        bot: [],
      },
      authorizedTwitterUsers: [],
      reactionRoleMessages: {},
    }
    this.ensure(guild.id, data)
  }

  async getGuild(guild: Discord.Guild): Promise<GuildData> {
    const data: GuildData = this.get(guild.id)
    if (data.logChannelID)
      data.logChannel = guild.channels.cache.get(
        data.logChannelID
      ) as Discord.TextChannel
    if (data.moderatorRoleID)
      data.moderatorRole = guild.roles.cache.get(data.moderatorRoleID)
    return data
  }
}

/** The Enmap database of bot system */
const db = new Database()

export default db
module.exports = db
