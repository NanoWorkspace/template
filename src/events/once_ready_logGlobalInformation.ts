import Globals from "../app/Globals"

const guildCreate = require("./on_guildCreate_updateDatabase")

module.exports = () => {
  console.log("EVENTS")
  console.table(Globals.events)
  console.log("COMMANDS")
  console.table(Globals.commands.keyArray())
  console.log("GUILDS")
  console.table(
    Globals.client.guilds.cache.mapValues((guild) => {
      guildCreate(guild)
      return guild.name
    })
  )
}
