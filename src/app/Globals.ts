import Discord from "discord.js"
import bot from "./Bot"
import client from "./Client"
import db from "./Database"
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

const Globals = {
  bot: bot,
  custom,
  db,
  client,
  owners,
  events: Event.events,
  cooldown: Command.cooldown,
  commands: Command.commands,
}

export default Globals
module.exports = Globals
