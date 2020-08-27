import Discord from "discord.js"
import bot from "../globals/bot"
import client from "../globals/client"
import db from "../globals/db"
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
  bot,
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
