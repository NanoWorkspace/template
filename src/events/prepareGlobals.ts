import Discord from "discord.js"
import Event from "../app/Event"
import Globals from "../app/Globals"

new Event({
  name: "ready",
  description: "Prepare globals on client is ready",
  caller: "once",
  call: async () => {
    const app = await Globals.client.fetchApplication()
    if (app.owner instanceof Discord.Team) {
      app.owner.members.forEach((member) => {
        Globals.owners.set(member.id, member.user)
      })
      Globals.bot.team = app.owner
    } else if (app.owner instanceof Discord.User) {
      Globals.owners.set(app.owner.id, app.owner)
    }
    Object.assign(Globals.bot, app)
  },
})
