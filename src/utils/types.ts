import Discord from "discord.js"
import Command, { CommandArgument } from "../app/Command"

type DiscordMentionableName = "channels" | "roles" | "members" | "users"
type DiscordMentionable =
  | Discord.GuildChannel
  | Discord.Role
  | Discord.GuildMember
  | Discord.User

async function discordMentionable(
  collection: DiscordMentionableName,
  content: string,
  message: Discord.Message
): Promise<{ arg: any; rest?: string }> {
  let item: DiscordMentionable | undefined | null = message.mentions[
    collection
  ]?.first()
  if (item) {
    message.mentions[collection]?.delete(item.id)
    return {
      arg: item,
      rest: content.replace(`${item}`, "").trim(),
    }
  }
  const regexID = /^(\d{17,20})(?:\D|$)/
  if (regexID.test(content)) {
    const [, id] = regexID.exec(content) as RegExpExecArray
    if (collection === "users") {
      item = message.client.users.resolve(id)
    } else {
      item = message.guild?.[collection]?.resolve(id)
    }
    if (item) {
      return {
        arg: item,
        rest: content.replace(item.id, "").trim(),
      }
    }
  }
  const { arg: w } = await kebab(content, message)
  if (w) {
    if (collection === "users") {
      item = message.client.users.cache.find((u) =>
        u.username.toLowerCase().includes(w.toLowerCase())
      )
    } else {
      // @ts-ignore
      item = message.guild?.[collection]?.cache.find((i) =>
        (i.displayName || i.name).toLowerCase().includes(w.toLowerCase())
      )
    }
    if (item) {
      return {
        arg: item,
        rest: content.replace(w, "").trim(),
      }
    }
  }
  return {
    arg: null,
  }
}

function justByRegex(
  regex: RegExp,
  content: string
): { arg: any; rest?: string } {
  const match = regex.exec(content)
  if (match) {
    const [, group] = match
    return { arg: group, rest: content.replace(regex, "").trim() }
  }
  return { arg: null }
}

export const command: CommandArgument = (content) => {
  const { command, rest } = Command.resolve(content)
  return { arg: command, rest }
}

export const text: CommandArgument = (content) => {
  return { arg: content.trim(), rest: "" }
}

export const word: CommandArgument = (content) => {
  return justByRegex(/^(\w+)/, content)
}

export const kebab: CommandArgument = (content) => {
  return justByRegex(/^([\w-]+)/, content)
}

export const snowflake: CommandArgument = (content) => {
  return justByRegex(/^(\d{17,20})(?:\D|$)/, content)
}

export const role: CommandArgument = async (content, message) => {
  return await discordMentionable("roles", content, message)
}

export const channel: CommandArgument = async (content, message) => {
  return await discordMentionable("channels", content, message)
}

export const member: CommandArgument = async (content, message) => {
  return await discordMentionable("members", content, message)
}

export const user: CommandArgument = async (content, message) => {
  return await discordMentionable("users", content, message)
}

export const action: CommandArgument = (content) => {
  const regexps: { [k: string]: RegExp } = {
    edit: /^(?:edit|patch|change)/i,
    get: /^get\s+/i,
    add: /^(?:add|new|post)\s+/i,
    remove: /^(?:remove|del(?:ete)?|rm)\s+/i,
    list: /^(?:list|ls|show)/i,
  }
  for (const key in regexps) {
    if (regexps[key].test(content)) {
      return {
        arg: key,
        rest: content.replace(regexps[key], "").trim(),
      }
    }
  }
  return {
    arg: null,
  }
}

export const boolean: CommandArgument = (content) => {
  const regex = /^(?:o(?:ui)?|y(?:es)?|true)/i
  return {
    arg: regex.test(content),
    rest: content.replace(regex, "").trim(),
  }
}

export const json: CommandArgument = (content) => {
  const regexJSON = /^(?:```(?:json)?\s+(.+)\s*```(?:[^`]|$)|(.+)$)?/is
  try {
    const [, g1, g2] = regexJSON.exec(content) as RegExpExecArray
    const json = JSON.parse(g1 || g2)
    return {
      arg: json,
      rest: content.replace(regexJSON, "").trim(),
    }
  } catch (error) {}
  return {
    arg: null,
  }
}

export default {
  command,
  text,
  word,
  action,
  boolean,
  json,
  channel,
  user,
  role,
  member,
  snowflake,
}
