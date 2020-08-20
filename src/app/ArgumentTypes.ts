import { CommandArgument } from "./Command"
import { resolveCommand } from "./Globals"
import Discord from "discord.js"

export const command: CommandArgument = (content) => {
  const { command, rest } = resolveCommand(content)
  return { arg: command, rest }
}

export const text: CommandArgument = (content) => {
  return { arg: content.trim(), rest: "" }
}

export const word: CommandArgument = (content) => {
  const regex = /^\w+/
  const match = regex.exec(content)
  if (match) {
    const [, word] = match
    return { arg: word, rest: content.replace(regex, "").trim() }
  }
  return { arg: "" }
}

export const role: CommandArgument = async (content, message) => {
  let role: Discord.Role | undefined | null = message.mentions.roles.first()
  if (role) {
    message.mentions.roles.delete(role.id)
    return {
      arg: role,
      rest: content.replace(`<@&${role.id}>`, "").trim(),
    }
  }
  const regexID = /^(\d{17,20})/
  if (regexID.test(content)) {
    const [, id] = regexID.exec(content) as RegExpExecArray
    role = message.guild?.roles.resolve(id)
    if (role) {
      return {
        arg: role,
        rest: content.replace(role.id, "").trim(),
      }
    }
  }
  const { arg: txt } = await text(content, message)
  if (txt) {
    role = message.guild?.roles.cache.find((r) =>
      r.name.toLowerCase().includes(txt.toLowerCase())
    )
    if (role) {
      return {
        arg: role,
        rest: content.replace(txt, "").trim(),
      }
    }
  }
  return {
    arg: null,
  }
}

export const action: CommandArgument = (content) => {
  const regexAdd = /^add\s+/i
  const regexRemove = /^(?:remove|del(?:ete)?|rm)\s+/i
  const regexList = /^(?:list|ls)/i
  if (regexAdd.test(content))
    return {
      arg: "add",
      rest: content.replace(regexAdd, "").trim(),
    }
  if (regexRemove.test(content))
    return {
      arg: "remove",
      rest: content.replace(regexRemove, "").trim(),
    }
  if (regexList.test(content))
    return {
      arg: "list",
      rest: content.replace(regexList, "").trim(),
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

export default {
  command,
  text,
  word,
  role,
  action,
  boolean,
}
