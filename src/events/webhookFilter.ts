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
          if (!embed) return await message.delete()

          if (/^@\S+/.test(embed.description || ""))
            return await message.delete()

          if (embed.author) {
            const tweetUserMatch = /\(@(.+)\)/.exec(String(embed.author.name))
            const tweetUser = tweetUserMatch ? tweetUserMatch[1] : null
            if (
              !tweetUser ||
              Globals.db
                .get(message.guild.id, "authorizedTwitterUsers")
                .every((user: string) => user !== tweetUser)
            ) {
              await message.delete()
            }
          } else {
            await message.delete()
          }
        } catch (error) {
          Logger.error(error, "in Webhook Filter event")
        }
      }
    }
  },
})
