import Discord from "discord.js"
import bot from "./bot"
import Logger from "../app/Logger"
import path from "path"
import File from "../utils/File"

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

  await File.forEachFile(
    [path.join(__dirname, "..", "modules")],
    (filePath) => {
      const fineName = path.basename(filePath)
      if (fineName === "module.js") require(filePath)
    }
  )

  // todo remove handlers for commands and events
  await File.forEachFile(
    [
      path.join(__dirname, "..", "events"),
      path.join(__dirname, "..", "commands"),
    ],
    (filePath) => {
      if (filePath.endsWith(".js")) require(filePath)
    }
  )

  client.emit("modulesReady")
})

client.on("raw", (packet) => {
  if (!/^MESSAGE_REACTION_(?:ADD|REMOVE)$/.test(packet.t)) return

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

      switch (packet.t.split("_")[2]) {
        case "ADD":
          client.emit("messageReactionAdd", reaction, user)
          break
        case "REMOVE":
          client.emit("messageReactionRemove", reaction, user)
          break
      }
    }
  })
})

export default client
module.exports = client
