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
  const regex = /^(-?\d+)(?:\D|$)/
  const match = regex.exec(content)
  if (match) {
    const number = Number(match[1])
    if (!Number.isNaN(number)) {
      return {
        arg: number,
        rest: content.replace(regex, "").trim(),
      }
    }
  }
  return {
    arg: null,
  }
}

export const numberBetween = (start: number, stop: number) => {
  const fn: CommandArgumentType = async (content) => {
    // @ts-ignore
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

export const boolean: CommandArgumentType = (content) => {
  return justByRegex(/^(?:o(?:ui)?|y(?:es)?|true)/i, content)
}

export const json: CommandArgumentType = (content) => {
  const regex = /^(?:```(?:json)?\s+(.+)\s*```(?:[^`]|$)|(.+)$)?/is
  try {
    const [, g1, g2] = regex.exec(content) as RegExpExecArray
    const json = JSON.parse(g1 || g2)
    return {
      arg: json,
      rest: content.replace(regex, "").trim(),
    }
  } catch (error) {}
  return {
    arg: null,
  }
}

export const text: CommandArgumentType = (content) => {
  return justByRegex(/^(?:"(.+?[^\\])"|(\S+))/is, content)
}

export const code: CommandArgumentType = (content) => {
  return justByRegex(
    /^(?:```(?:[a-z]+)?\s+(.+)\s*```(?:[^`]|$)|(.+)$)/is,
    content
  )
}

export const emoji: CommandArgumentType = (content, message) => {
  let regex = /^<a?:\S+?:(\d{17,20})>/i
  const match = regex.exec(content)
  if (match) {
    const emoji = message.client.emojis.cache.get(match[1])
    if (emoji) {
      return {
        arg: emoji,
        rest: content.replace(regex, "").trim(),
      }
    } else {
      return word(content, message)
    }
  }
  return { arg: null }
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
  const regex = /^(\d{17,20})(?:\D|$)/
  if (regex.test(content)) {
    const [, id] = regex.exec(content) as RegExpExecArray
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
    const [fm, g1, g2, g3, g4, g5] = match
    return {
      arg: g1 || g2 || g3 || g4 || g5 || fm,
      rest: content.replace(regex, "").trim(),
    }
  }
  return { arg: null }
}

export default {
  command,
  rest,
  word,
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
  emoji,
  text,
}
