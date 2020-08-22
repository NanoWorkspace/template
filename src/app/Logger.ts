import chalk from "chalk"
import Discord from "discord.js"

const { bot } = require("../../package.json")

function space() {
  console.log("")
}

function load(type: string, ...args: any[]) {
  console.log(
    chalk.green("load"),
    chalk.cyanBright(type.toUpperCase()),
    ...args
  )
}

function error(err: Error) {}

space()
load("file", __filename)

export default {
  load,
  space,
  ready() {
    space()
    console.log(
      chalk.green("ready"),
      "Try me with the",
      chalk.magentaBright(`${bot.prefix}help`),
      "command!"
    )
  },
  guild(
    guild: Discord.Guild,
    type: string,
    title: string,
    description: string
  ) {
    console.log(
      chalk.redBright("guild"),
      chalk.cyanBright(type.toUpperCase()),
      title,
      chalk.gray(description),
      guild.name
    )
    const { db } = require("./Database")
    const logChannelID = db.get(guild.id, "logChannel")
    if (logChannelID) {
      const logChannel = guild.channels.resolve(logChannelID)
      if (logChannel instanceof Discord.TextChannel) {
        const Embed = require("./Embed")
        const embed = new Embed()
          .setTemplate("log", description)
          .setTitle(`${type.toUpperCase()} | ${title}`)
        logChannel.send(embed).catch(error)
      }
    }
  },
}
