import Globals from "../app/Globals"
import Time from "../utils/Time"
import Event from "../app/Event"
import Logger from "../app/Logger"

new Event({
  name: "message",
  description: "Filter webhooks on message create",
  caller: "on",
  call: async (message) => {
    // webhook filter
    if (message.webhookID && message.guild) {
      // waiting embed loading
      await Time.wait(10000)

      // twitter
      if (/^https?:\/\/twitter\.com/.test(message.content)) {
        const embed = message.embeds[0]

        if (!message.deleted) return

        try {
          if (!embed)
            return Globals.client.emit(
              "webhookFilter",
              message,
              "failed to fetch embed"
            )

          if (/^@\S+/.test(embed.description || ""))
            return Globals.client.emit(
              "webhookFilter",
              message,
              "is a response tweet"
            )

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
            }
          } else {
            Globals.client.emit(
              "webhookFilter",
              message,
              "not author in tweet embed"
            )
          }
        } catch (error) {
          Logger.error(error, "in Webhook Filter event")
        }
      }
    }
  },
})

new Event({
  name: "webhookFilter",
  caller: "on",
  description: "Delete webhook on filter",
  call: async (message, reason) => {
    Logger.log("Webhook filtered", { reason })
    await message.delete()
  },
})
