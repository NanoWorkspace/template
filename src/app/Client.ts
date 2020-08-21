const { bot } = require("../../package.json")

import Discord from "discord.js"

export const client = new Discord.Client(bot.clientOptions)
