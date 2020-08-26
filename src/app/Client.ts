import Discord from "discord.js"
import bot from "./Bot"
import Logger from "./Logger"

Logger.load("file", __filename)

const client = new Discord.Client(bot.clientOptions)

export default client
module.exports = client
