import Discord from "discord.js"
import Globals from "../app/Globals"

module.exports = (guild: Discord.Guild) => {
  Globals.db.delete(guild.id)
}
