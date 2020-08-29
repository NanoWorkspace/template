import Discord from "discord.js"
import bot from "./bot"
import Logger from "../app/Logger"
import fs from "fs"
import path from "path"

Logger.load("file", __filename)

const client = new Discord.Client(bot.clientOptions)

client.once("ready", async () => {
  const app = await client.fetchApplication()
  if (app.owner instanceof Discord.Team) {
    app.owner.members.forEach((member) => {
      bot.owners.set(member.id, member.user)
    })
    bot.team = app.owner
  } else if (app.owner instanceof Discord.User) {
    bot.owners.set(app.owner.id, app.owner)
  }
  Object.assign(bot, app)

  fs.readdirSync(path.join(__dirname, "..", "commands")).forEach((fileName) => {
    require(path.join(__dirname, "..", "commands", fileName))
  })

  fs.readdirSync(path.join(__dirname, "..", "events")).forEach((fileName) => {
    require(path.join(__dirname, "..", "events", fileName))
  })

  client.emit("nanoReady")
})

client.on("raw", (packet) => {
  if (!["MESSAGE_REACTION_ADD", "MESSAGE_REACTION_REMOVE"].includes(packet.t))
    return

  const channel = client.channels.cache.get(
    packet.d.channel_id
  ) as Discord.TextChannel

  if (!channel) return
  if (channel.type !== "text") return
  if (channel.messages.cache.has(packet.d.message_id)) return

  channel.messages.fetch(packet.d.message_id).then((message) => {
    const emoji = packet.d.emoji.id
      ? `${packet.d.emoji.name}:${packet.d.emoji.id}`
      : packet.d.emoji.name
    const reaction = message.reactions.cache.get(emoji)

    if (reaction) {
      const user = client.users.cache.get(packet.d.user_id) as Discord.User
      reaction.users.cache.set(packet.d.user_id, user)

      switch (packet.t) {
        case "MESSAGE_REACTION_ADD":
          client.emit("messageReactionAdd", reaction, user)
          break
        case "MESSAGE_REACTION_REMOVE":
          client.emit("messageReactionRemove", reaction, user)
          break
      }
    }
  })
})

export default client
module.exports = client
