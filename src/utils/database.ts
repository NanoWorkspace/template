import Discord from "discord.js"
import Globals from "../app/Globals"

export function ensureGuild(guild: Discord.Guild) {
  Globals.db.ensure(guild.id, {
    prefix: Globals.bot.prefix,
    logChannel: null,
    autoRoles: {
      user: [],
      bot: [],
    },
    authorizedTwitterUsers: [],
  })
}

export default {
  ensureGuild,
}
