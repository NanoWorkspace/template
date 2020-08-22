import Discord from "discord.js"
import { bot } from "./Bot"
import Logger from "./Logger"

Logger.load("file", __filename)

export const client = new Discord.Client(bot.clientOptions)
