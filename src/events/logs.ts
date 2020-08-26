import chalk from "chalk"
import Globals from "../app/Globals"
import Logger from "../app/Logger"
import Event from "../app/Event"

new Event({
  name: "ready",
  caller: "once",
  description: "Log globals info on client is ready",
  call: () => {
    // events
    Logger.space()
    Globals.events.forEach((listeners, name) => {
      listeners.forEach((event) => {
        Logger.load(
          "event",
          chalk.yellow(event.caller),
          event.name,
          chalk.grey(event.description)
        )
      })
    })

    // commands
    Logger.space()
    Globals.commands.forEach((command) => {
      Logger.load("command", command.name, chalk.gray(command.description))
    })

    // guilds
    Logger.space()
    let guildsToShow = Globals.client.guilds.cache
      .array()
      .sort((g1, g2) => {
        return g2.memberCount - g1.memberCount
      })
      .slice(0, 10)
    guildsToShow.forEach((guild, i) => {
      Logger.load("guild", { memberCount: guild.memberCount }, guild.name)
    })
    if (guildsToShow.length < Globals.client.guilds.cache.size) {
      Logger.load(
        "guild",
        "... ( +",
        Globals.client.guilds.cache.size - guildsToShow.length,
        "guilds )"
      )
    }

    Logger.ready()
  },
})
