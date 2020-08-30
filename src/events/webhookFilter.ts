import Discord from "discord.js"
import Globals from "../app/Globals"
import Time from "../utils/Time"
import Event from "../app/Event"
import Logger from "../app/Logger"
import Embed from "../app/Embed"

new Event({
  name: "message",
  description: "Filter webhooks on message create",
  caller: "on",
  call: async (message) => {
    // webhook filter
    if (message.webhookID && message.guild) {
      // waiting embed loading
      await Time.wait(10000)

      let newEmbeds: Discord.MessageEmbed[] = []

      // twitter
      if (/^https?:\/\/twitter\.com/.test(message.content)) {
        const embeds = message.embeds

        if (!message.deleted) return

        for (const embed of embeds) {
          try {
            if (!embed) {
              Globals.client.emit(
                "webhookFilter",
                message,
                "failed to fetch embed"
              )
              break
            }

            if (/^@\S+/.test(embed.description || "")) {
              Globals.client.emit(
                "webhookFilter",
                message,
                "is a response tweet"
              )
              break
            }

            if (embed.author) {
              const tweetUserMatch = /\(@(.+)\)/.exec(String(embed.author.name))
              const tweetUser = tweetUserMatch ? tweetUserMatch[1] : null
              if (
                !tweetUser ||
                Globals.db
                  .get(message.guild.id, "authorizedTwitterUsers")
                  .every((user: string) => user !== tweetUser)
              ) {
                Globals.client.emit(
                  "webhookFilter",
                  message,
                  "unauthorized tweet user"
                )
                break
              }
            } else {
              Globals.client.emit(
                "webhookFilter",
                message,
                "not author in tweet embed"
              )
              break
            }

            newEmbeds.push(embed)
          } catch (error) {
            Logger.error(error, "in Webhook Filter event")
          }
        }

        if (embeds.length < newEmbeds.length) {
          await message.delete()
          for (const embed of newEmbeds) {
            await message.channel.send(new Discord.MessageEmbed(embed))
          }
        }
      }
    }
  },
})

new Event({
  name: "webhookFilter",
  caller: "on",
  description: "Delete webhook on filter",
  call: (message, reason) => {
    Logger.log("Webhook filtered", { reason })
  },
})
