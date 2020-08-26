import Database from "../utils/database"
import Globals from "../app/Globals"
import Event from "../app/Event"

new Event({
  name: "ready",
  caller: "once",
  description: "Update db on client is ready",
  call: () => {
    Globals.client.guilds.cache.forEach(Database.ensureGuild)
  },
})

new Event({
  name: "guildCreate",
  caller: "on",
  description: "Update db on guild is create",
  call: Database.ensureGuild,
})

new Event({
  name: "guildDelete",
  caller: "on",
  description: "Update db on guild is delete",
  call: (guild) => {
    Globals.db.delete(guild.id)
  },
})
