import Discord from "discord.js"
import Globals from "../app/Globals"
import Time from "../utils/time"
import Event from "../app/Event"

new Event<"message">({
  name: "message",
  description: "Filter webhooks on message create",
  caller: "on",
  call: async (message) => {
    // webhook filter
    if (message.webhookID && message.guild) {
      // waiting embed loading
      await Time.wait(5000)

      // twitter
      if (message.content.startsWith("http://twitter.com")) {
        const embed = message.embeds[0]

        if (!message.deleted) return

        try {
          if (!embed || /^@\S+/.test(embed.description || "")) {
            await message.delete()
          } else if (embed.author) {
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
        } catch (error) {}
      }
    }
  },
})
