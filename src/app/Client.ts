import Discord from "discord.js"
import bot from "./Bot"
import Logger from "./Logger"

Logger.load("file", __filename)

const client = new Discord.Client(bot.clientOptions)

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
