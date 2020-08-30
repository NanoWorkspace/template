import chalk from "chalk"

// todo: allow custom template for logs

const config = require("../../nano.config.json")

abstract class Logger {
  static space() {
    console.log("")
  }

  static auto(...values: any[]) {
    console.log(
      ...values.map((value, index, src) => {
        if (typeof value === "string") {
          if (index === 0) {
            if (value.includes("Error")) {
              return chalk.blackBright.bgRed.bold(" " + value + " ")
            } else {
              return chalk.green(value)
            }
          } else if (index === 1 && src[0].includes("Error")) {
            return chalk.redBright(value)
          } else if (index === src.length - 1 || /\.$/.test(value)) {
            return chalk.grey(value)
          } else if (/^[A-Z]+$/.test(value)) {
            return chalk.cyanBright(value)
          } else if (/^[a-z]{,5}$/.test(value)) {
            return chalk.yellowBright(value)
          }
        }
        return value
      })
    )
  }

  static log(title: string, ...values: any[]) {
    console.log(chalk.green(title), ...values)
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
      chalk.magentaBright(`${config.prefix}help`),
      "command!"
    )
  }
}

Logger.space()
Logger.load("file", __filename)

export default Logger
module.exports = Logger
