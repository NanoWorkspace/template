const { bot } = require("../../package.json")

import { client } from "./Client"
import { db } from "./Database"
import { events } from "./Event"
import Command from "./Command"

/** Your own global object (you can put your own database inside!) */
export const custom: {} = {}

export default {
  bot,
  custom,
  own: custom,
  db,
  client,
  events,
  cooldown: Command.cooldown,
  commands: Command.commands,
}
