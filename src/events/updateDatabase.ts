import Event from "../app/Event"
import Globals from "../app/Globals"

new Event({
  name: "nanoReady",
  caller: "once",
  description: "Prepare database on nano is ready",
  call: () => {
    Globals.client.guilds.cache.forEach((guild) => {
      Globals.db.ensureGuild(guild)
    })
    Globals.custom.databaseReady = true
    Globals.client.emit("databaseReady")
  },
})

new Event({
  name: "guildCreate",
  caller: "on",
  description: "Update database on guild is create",
  call: (guild) => Globals.db.ensureGuild(guild),
})

new Event({
  name: "guildDelete",
  caller: "on",
  description: "Update database on guild is delete",
  call: (guild) => Globals.db.delete(guild.id),
})
