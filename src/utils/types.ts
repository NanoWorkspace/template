import Discord from "discord.js"
import Command, { CommandArgumentType } from "../app/Command"

type DiscordMentionableName = "channels" | "roles" | "members" | "users"
type DiscordMentionable =
  | Discord.GuildChannel
  | Discord.Role
  | Discord.GuildMember
  | Discord.User

export const command: CommandArgumentType = (content) => {
  const { command, rest } = Command.resolve(content)
  return { arg: command, rest }
}

export const rest: CommandArgumentType = (content) => {
  return { arg: content.trim(), rest: "" }
}

export const number: CommandArgumentType = (content) => {
  const regexNumber = /^(-?\d+)(?:\D|$)/
  const match = regexNumber.exec(content)
  if (match) {
    const number = Number(match[1])
    if (!Number.isNaN(number)) {
      return {
        arg: number,
        rest: content.replace(regexNumber, "").trim(),
      }
    }
  }
  return {
    arg: null,
  }
}

export const numberBetween = (start: number, stop: number) => {
  const fn: CommandArgumentType = async (content) => {
    const { arg: num, rest } = await number(content)
    if (num < start || num > stop) {
      return { arg: null }
    }
    return { arg: num, rest }
  }
  return fn
}

export const word: CommandArgumentType = (content) => {
  return justByRegex(/^(\S+)(?:\s|$)/, content)
}

export const snowflake: CommandArgumentType = (content) => {
  return justByRegex(/^(\d{17,20})(?:\D|$)/, content)
}

export const role: CommandArgumentType = async (content, message) => {
  return await discordMentionable("roles", content, message as Discord.Message)
}

export const channel: CommandArgumentType = async (content, message) => {
  return await discordMentionable(
    "channels",
    content,
    message as Discord.Message
  )
}

export const member: CommandArgumentType = async (content, message) => {
  return await discordMentionable(
    "members",
    content,
    message as Discord.Message
  )
}

export const user: CommandArgumentType = async (content, message) => {
  return await discordMentionable("users", content, message as Discord.Message)
}

export const action: CommandArgumentType = (content) => {
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

export const boolean: CommandArgumentType = (content) => {
  const regex = /^(?:o(?:ui)?|y(?:es)?|true)/i
  return {
    arg: regex.test(content),
    rest: content.replace(regex, "").trim(),
  }
}

export const json: CommandArgumentType = (content) => {
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

export const code: CommandArgumentType = (content) => {
  const regexCode = /^(?:```(?:[a-z]+)?\s+(.+)\s*```(?:[^`]|$)|(.+)$)?/is
  const [, g1, g2] = regexCode.exec(content) as RegExpExecArray
  return {
    arg: g1 || g2,
    rest: content.replace(regexCode, "").trim(),
  }
}

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
  // @ts-ignore
  const { arg: w } = await word(content)
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

export default {
  command,
  rest,
  word,
  action,
  boolean,
  json,
  code,
  channel,
  user,
  role,
  member,
  snowflake,
  number,
  numberBetween,
}
