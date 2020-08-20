import Discord from "discord.js"
import Globals from "./Globals"

export interface CommandObject {
  name: string
  regex: RegExp
  owner?: boolean
  admin?: boolean
  permissions?: Discord.PermissionResolvable[]
  users?: Discord.UserResolvable[]
  channelType?: "dm" | "guild"
  cooldown?: number
  typing?: boolean
  description?: string
  examples?: string[]
  args?: { [name: string]: CommandArgument }
  call: (event: CommandEvent) => void
}

export interface CommandEvent {
  message: Discord.Message
  args: { [name: string]: any }
}

export type CommandArgument = (
  content: string,
  message: Discord.Message
) => Promise<{ arg: any; rest?: string }> | { arg: any; rest?: string }
