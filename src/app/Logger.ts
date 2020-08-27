import chalk from "chalk"
import Discord from "discord.js"

// todo: make Logger as class and allow custom template for logs

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

function error(err: Error, ...args: any[]) {
  console.error(
    chalk.blackBright.bgRed.bold(" " + err.name + " "),
    chalk.redBright(err.message),
    ...args
  )
}

space()
load("file", __filename)

export default {
  load,
  space,
  error,
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
    const { db } = require("../globals/db")
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
