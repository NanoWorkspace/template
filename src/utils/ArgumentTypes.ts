import Discord from "discord.js"
import Command, { CommandArgumentType } from "../app/Command"
import Globals from "../app/Globals"
import Text from "./Text"

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
  const regex = Text.improvePattern(/(-?\d+)/)
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
  return justByRegex(/(\w+)/, content)
}

export const snowflake: CommandArgumentType = (content) => {
  return justByRegex(/(\d{15,25})/, content)
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
  return justByRegex(/(?:o(?:ui)?|y(?:es)?|true)/i, content)
}

export const json: CommandArgumentType = (content) => {
  const regex = Text.improvePattern(/```(?:json)?\s+(.+)\s*```|(.+)/is)
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
  return justByRegex(/(?:"(.+?[^\\])"|(\S+))/is, content)
}

export const code: CommandArgumentType = (content) => {
  return justByRegex(/(?:```(?:[a-z]+)?\s+(.+)\s*```|(.+))/is, content)
}

/** Return an emoji or an unicode suite as arg. */
export const emoji: CommandArgumentType = async (content, message) => {
  let regex = Text.improvePattern(/<a?:\S+?:(\d{17,20})>/i)
  let match = regex.exec(content)
  if (match) {
    const emoji = message.client.emojis.cache.get(match[1])
    if (emoji) {
      return {
        arg: emoji,
        rest: content.replace(regex, "").trim(),
      }
    }
  }
  regex = Text.improvePattern(/(:\w+:)/i)
  match = regex.exec(content)
  if (match) {
    const emoji = match[1]
    const user = await Globals.client.users.fetch("352176756922253321")
    const msg = await user.send("\\" + emoji)
    const unicode = msg.content
    if (emoji !== unicode) {
      return {
        arg: unicode,
        rest: content.replace(regex, "").trim(),
      }
    }
  }
  const emoji = content.trim()
  if (emoji.length < 2) {
    return {
      arg: null,
    }
  }

  return { arg: emoji, rest: "" }
}

export function arrayFrom(
  ...types: CommandArgumentType[]
): CommandArgumentType {
  return async (content, message) => {
    const output = []
    let result: { arg: any; rest?: string } = { arg: null }
    do {
      for (const type of types) {
        if (typeof type === "function") {
          result = await type(content, message)
          if (result.arg !== null) {
            content = result.rest as string
            output.push(result.arg)
            break
          }
        }
        // todo: manage other type than "function" of CommandArgumentType.
      }
    } while (result.arg !== null)
    return { arg: output, rest: content.trim() }
  }
}

async function discordMentionable(
  collection: DiscordMentionableName,
  content: string,
  message: Discord.Message
): Promise<{ arg: any; rest?: string }> {
  // Try mention
  // @ts-ignore
  let item: DiscordMentionable | undefined | null = message.mentions[
    collection
  ]?.first()
  if (item) {
    message.mentions[collection]?.delete(item.id)
    return {
      arg: item,
      rest: content.replace(item.toString(), "").trim(),
    }
  }

  // Try Snowflake
  const regex = Text.improvePattern(/(\d{17,20})/)
  const match = regex.exec(content)
  if (match) {
    const [, id] = match
    if (collection === "users") {
      // @ts-ignore
      item = message.client.users.resolve(id)
    } else {
      // @ts-ignore
      item = message.guild?.[collection]?.resolve(id)
    }
    if (item) {
      return {
        arg: item,
        rest: content.replace(regex, "").trim(),
      }
    }
  }

  // Try name
  // @ts-ignore
  const { arg: txt } = await text(content)
  if (txt) {
    if (collection === "users") {
      item = message.client.users.cache.find((u) => {
        return u.username.toLowerCase().includes(txt.toLowerCase())
      })
    } else {
      // @ts-ignore
      item = message.guild?.[collection]?.cache.find((i) => {
        return (i.displayName || i.name)
          .toLowerCase()
          .includes(txt.toLowerCase())
      })
    }
    if (item) {
      return {
        arg: item,
        rest: content.replace(txt, "").trim(),
      }
    }
  }

  // abort
  return {
    arg: null,
  }
}

function justByRegex(
  regex: RegExp,
  content: string
): { arg: any; rest?: string } {
  const pattern = Text.improvePattern(regex)
  const match = pattern.exec(content)
  if (match) {
    const [fm, g1, g2, g3, g4, g5] = match
    return {
      arg: g1 || g2 || g3 || g4 || g5 || fm,
      rest: content.replace(pattern, "").trim(),
    }
  }
  return { arg: null }
}

/** Filters to use for command arguments type checking */
const ArgumentTypes = {
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
  arrayFrom,
}

export default ArgumentTypes
module.exports = ArgumentTypes
