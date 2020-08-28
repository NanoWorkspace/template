import chalk from "chalk"
import Discord from "discord.js"

// todo: allow custom template for logs

const { bot } = require("../../package.json")

abstract class Logger {
  static space() {
    console.log("")
  }

  static load(type: string, ...args: any[]) {
    console.log(
      chalk.green("load"),
      chalk.cyanBright(type.toUpperCase()),
      ...args
    )
  }

  static error(err: Error, ...args: any[]) {
    console.error(
      chalk.blackBright.bgRed.bold(" " + err.name + " "),
      chalk.redBright(err.message),
      ...args
    )
  }

  static ready() {
    this.space()
    console.log(
      chalk.green("ready"),
      "Try me with the",
      chalk.magentaBright(`${bot.prefix}help`),
      "command!"
    )
  }

  static mod(guild: Discord.Guild, ...values: (number | string)[]) {
    console.log(chalk.cyanBright("log"), values[0], ...values.map(chalk.gray))
    require("../globals/db")
      .getGuild(guild)
      .then(({ logChannel }: any) => {
        if (logChannel instanceof Discord.TextChannel) {
          logChannel
            .send(
              require("./Embed")
                .log(values.slice(1).join("\n"))
                .setTitle(String(values[0]))
            )
            .catch(this.error)
        }
      })
  }
}

Logger.space()
Logger.load("file", __filename)

export default Logger
module.exports = Logger
