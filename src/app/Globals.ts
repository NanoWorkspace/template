const { bot } = require("../../package.json")

import Discord from "discord.js"
import Enmap from "enmap"
import path from "path"
import fs from "fs"
import { CommandObject } from "./Command"

/** Your own global object (you can put your own database inside!) */
export const custom: {} = {}

/** The Enmap database of */
export const db = new Enmap({ name: "db" })

export const commands: Discord.Collection<
  string,
  CommandObject
> = new Discord.Collection()

export function resolveCommand(
  resolvable: string
): { command?: CommandObject; rest?: string } {
  let command = commands.find((c) => c.regex.test(resolvable))
  if (command)
    return { command, rest: resolvable.replace(command.regex, "").trim() }
  return {}
}

export function addCommand(command: CommandObject) {
  commands.set(command.name, command)
  command.regex = new RegExp(
    `^(?:${command.regex.source})(?:\\s+|$)`,
    command.regex.flags
  )
}

fs.readdirSync(path.join(__dirname, "..", "commands")).forEach((fileName) => {
  addCommand(require(path.join(__dirname, "..", "commands", fileName)))
})

export const client = new Discord.Client(bot.clientOptions)

export const events: string[][] = []

fs.readdirSync(path.join(__dirname, "..", "events")).forEach((fileName) => {
  const eventInfo = fileName.slice(0, fileName.lastIndexOf(".")).split("_")
  const [fn, eventName] = eventInfo
  client[fn as "on" | "once"](
    eventName,
    require(path.join(__dirname, "..", "events", fileName))
  )
  events.push(eventInfo)
})

/** Contains timestamps of last commands usage for each user */
export const cooldown: {
  [user: string]: { [commandName: string]: number }
} = {}

export default {
  custom,
  own: custom,
  db,
  commands,
  client,
  events,
  cooldown,
}
