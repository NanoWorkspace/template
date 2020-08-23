import Discord from "discord.js"
import fs from "fs"
import path from "path"
import Logger from "./Logger"

Logger.load("file", __filename)

export interface CommandOptions {
  name: string
  regex: RegExp
  botOwner?: true
  owner?: true
  admin?: true
  permissions?: Discord.PermissionResolvable[]
  users?: Discord.UserResolvable[]
  channelType?: "dm" | "guild"
  cooldown?: number
  typing?: true
  description?: string
  examples?: string[]
  args?: { [name: string]: CommandArgument }
  call: (event: CommandEvent) => Promise<any> | any
}

export interface CommandEvent {
  message: Discord.Message
  args: { [name: string]: any }
}

export type CommandArgument = (
  content: string,
  message: Discord.Message
) => Promise<{ arg: any; rest?: string }> | { arg: any; rest?: string }

export default class Command {
  /** Contains timestamps of last commands usage for each user */
  static cooldown: {
    [user: string]: { [commandName: string]: number }
  } = {}

  /** Contains all loaded commands */
  static commands: Discord.Collection<
    string,
    Command
  > = new Discord.Collection()

  constructor(public options: CommandOptions) {
    Command.commands.set(options.name, this)
    this.options.regex = new RegExp(
      `^(?:${this.regex.source})(?:\\s+|$)`,
      this.regex.flags
    )
  }

  get name() {
    return this.options.name
  }
  get regex() {
    return this.options.regex
  }
  get botOwner() {
    return this.options.botOwner
  }
  get owner() {
    return this.options.owner
  }
  get admin() {
    return this.options.admin
  }
  get permissions() {
    return this.options.permissions
  }
  get users() {
    return this.options.users
  }
  get channelType() {
    return this.options.channelType
  }
  get cooldown() {
    return this.options.cooldown
  }
  get typing() {
    return this.options.typing
  }
  get description() {
    return this.options.description
  }
  get examples() {
    return this.options.examples
  }
  get args() {
    return this.options.args
  }

  async call(event: CommandEvent) {
    await this.options.call(event)
  }

  static resolve(resolvable: string): { command?: Command; rest?: string } {
    let command = Command.commands.find((c) => c.regex.test(resolvable))
    if (command)
      return { command, rest: resolvable.replace(command.regex, "").trim() }
    return {}
  }
}

fs.readdirSync(path.join(__dirname, "..", "commands")).forEach((fileName) => {
  require(path.join(__dirname, "..", "commands", fileName))
})
