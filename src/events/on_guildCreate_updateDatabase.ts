const { bot } = require("../../package.json")
import Discord from "discord.js"
import Globals from "../app/Globals"

module.exports = (guild: Discord.Guild) => {
  Globals.db.ensure(guild.id, {
    prefix: bot.prefix,
    autoRoles: {
      user: [],
      bot: [],
    },
    authorizedTwitterUsers: [],
  })
}
