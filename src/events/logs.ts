import chalk from "chalk"
import Globals from "../app/Globals"
import Logger from "../app/Logger"
import Event from "../app/Event"
import Command from "../app/Command"

new Event({
  name: "databaseReady",
  caller: "once",
  description: "Log globals info on nano is ready",
  call: () => {
    // events
    Logger.space()
    Event.events.forEach((listeners, name) => {
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
    Command.commands.forEach((command) => {
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
      Logger.load(
        "guild",
        {
          memberCount: guild.memberCount,
          prefix: Globals.db.get(guild.id, "prefix"),
        },
        chalk.whiteBright(guild.name)
      )
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
