import Discord from "discord.js"
import { bot } from "./Bot"
import { client } from "./Client"
import { db } from "./Database"
import Event from "./Event"
import Command from "./Command"
import Logger from "./Logger"

Logger.load("file", __filename)

/** Your own global object (you can put your own database inside!) */
export const custom: {} = {}

/** Collection of this bot owners */
export const owners: Discord.Collection<
  string,
  Discord.User
> = new Discord.Collection()

export default {
  bot: bot,
  custom,
  own: custom,
  db,
  client,
  owners,
  events: Event.events,
  cooldown: Command.cooldown,
  commands: Command.commands,
}

module.exports = {
  bot: bot,
  custom,
  own: custom,
  db,
  client,
  owners,
  events: Event.events,
  cooldown: Command.cooldown,
  commands: Command.commands,
}
