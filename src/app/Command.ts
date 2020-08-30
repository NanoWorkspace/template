import Discord from "discord.js"
import Logger from "./Logger"
import Text from "../utils/Text"
import ArgumentTypes from "../utils/ArgumentTypes"

Logger.load("file", __filename)

export interface CommandOptions {
  name: string
  pattern: RegExp
  botOwner?: true
  owner?: true
  admin?: true
  moderator?: true
  permissions?: Discord.PermissionResolvable[]
  botPermissions?: Discord.PermissionResolvable[]
  users?: Discord.UserResolvable[]
  channelType?: "dm" | "guild"
  cooldown?: number
  typing?: true
  description?: string
  examples?: string[]
  args?: CommandArgumentGroup | CommandArgumentGroup[]
  call: (event: CommandEvent) => Promise<any> | any
}

export interface CommandArgumentGroup {
  [name: string]: CommandArgument
}

export interface CommandEvent {
  message: Discord.Message
  args: { [name: string]: any }
}

export interface CommandArgument {
  optional?: true
  default?: any
  defaultIndex?: number
  description?: string
  index?: boolean
  type: CommandArgumentType
}

export type CommandArgumentType =
  | ((
      content: string,
      message: Discord.Message
    ) => Promise<{ arg: any; rest?: string }> | { arg: any; rest?: string })
  | string
  | number
  | RegExp
  | (string | number | RegExp)[]
  | Array<string | number | RegExp>

export interface GroupStatus {
  index?: CommandArgument
  validatedIndex?: boolean
  argumentStatus: CommandArgumentStatus[]
  aborted?: boolean
}

export interface CommandArgumentStatus {
  name: string
  status: string
  description?: string
}

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

  static types = ArgumentTypes

  public readonly originalPattern: RegExp

  constructor(public options: CommandOptions) {
    Command.commands.set(options.name, this)
    this.originalPattern = new RegExp(this.options.pattern)
    this.options.pattern = Text.improvePattern(this.originalPattern)
  }

  get name() {
    return this.options.name
  }
  get pattern() {
    return this.options.pattern
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

  async parseArgs(message: Discord.Message, content: string) {
    const baseContent = content
    let args: { [name: string]: any } = {}
    if (this.args) {
      let groups: CommandArgumentGroup[]

      if (Array.isArray(this.args)) {
        groups = this.args
      } else {
        groups = [this.args]
      }

      const status: GroupStatus[] = []
      let error = false

      const scalar = function (
        v: string | number | RegExp,
        c: string
      ): { arg: any; rest?: string } {
        if (v instanceof RegExp) {
          const p = Text.improvePattern(v)
          const m = p.exec(c)
          if (m) {
            return {
              arg: m[2] || m[1] || m[0],
              rest: c.replace(p, "").trim(),
            }
          }
        } else if (c.startsWith(String(v))) {
          return {
            arg: v,
            rest: c.replace(String(v), "").trim(),
          }
        }
        return { arg: null }
      }

      for (const group of groups) {
        const groupStatus: GroupStatus = {
          argumentStatus: [],
        }
        const groupIndex = groups.indexOf(group)
        error = false

        for (const name in group) {
          const {
            type,
            default: _default,
            defaultIndex,
            optional,
            index: argIsIndex,
            description,
          } = group[name]

          const argumentStatus: CommandArgumentStatus = {
            name,
            status: "given",
            description,
          }

          if (typeof type === "function") {
            const { arg, rest } = await type(content, message)
            args[name] = arg
            content = rest === undefined ? content : rest
          } else if (Array.isArray(type)) {
            let i = 0
            for (const option of type) {
              const result = scalar(option, content)
              if (result.arg !== null) {
                content = result.rest as string
                args[name + "Index"] = i
                break
              }
              i++
            }
          } else {
            const result = scalar(type, content)
            if (result.arg !== null) {
              content = result.rest as string
              args[name] = result.arg
            }
          }

          if (args[name] === null || args[name] === undefined) {
            if (_default !== undefined) {
              args[name] = _default
              argumentStatus.status = "default value"
            } else if (defaultIndex !== undefined) {
              args[name + "Index"] = defaultIndex
              argumentStatus.status = "default index"
            } else if (optional) {
              args[name] = null
              argumentStatus.status = "optional"
            } else {
              error = true
              argumentStatus.status = "missing"
            }
          }

          groupStatus.argumentStatus.push(argumentStatus)

          if (!error && argIsIndex) {
            groupStatus.validatedIndex = true
          }

          // if error, clean args and break
          if (error) {
            if (groupIndex < groups.length - 1) {
              args = {}
              content = baseContent
              groupStatus.aborted = true
              break
            } else {
              // last group
            }
          }
        }
        status.push(groupStatus)

        // if last group is good, break
        if (!error) break
      }
      if (error) throw new Error(JSON.stringify(status))
    }
    return args
  }

  static resolve(resolvable: string): { command?: Command; rest?: string } {
    let command = Command.commands.find((c) => c.pattern.test(resolvable))
    if (command)
      return { command, rest: resolvable.replace(command.pattern, "").trim() }
    return {}
  }
}
