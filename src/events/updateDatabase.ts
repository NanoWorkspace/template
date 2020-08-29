import Event from "../app/Event"
import Globals from "../app/Globals"

new Event({
  name: "nanoReady",
  caller: "once",
  description: "Update db on client is ready",
  call: () => {
    Globals.client.guilds.cache.forEach((guild) => {
      Globals.db.ensureGuild(guild)
    })
  },
})

new Event({
  name: "guildCreate",
  caller: "on",
  description: "Update db on guild is create",
  call: (guild) => Globals.db.ensureGuild(guild),
})

new Event({
  name: "guildDelete",
  caller: "on",
  description: "Update db on guild is delete",
  call: (guild) => Globals.db.delete(guild.id),
})
