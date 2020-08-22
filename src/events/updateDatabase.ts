import Database from "../utils/database"
import Globals from "../app/Globals"
import Event from "../app/Event"
import Discord from "discord.js"

new Event<"ready">({
  name: "ready",
  caller: "once",
  description: "Update db on client is ready",
  call: () => {
    Globals.client.guilds.cache.forEach(Database.ensureGuild)
  },
})

new Event<"guildCreate">({
  name: "guildCreate",
  caller: "on",
  description: "Update db on guild is create",
  call: Database.ensureGuild,
})

new Event<"guildDelete">({
  name: "guildDelete",
  caller: "on",
  description: "Update db on guild is delete",
  call: (guild) => {
    Globals.db.delete(guild.id)
  },
})
