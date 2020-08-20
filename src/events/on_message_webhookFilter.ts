import Discord from "discord.js"
import Globals from "../app/Globals"
import time from "../utils/time"

module.exports = async (message: Discord.Message) => {
  // webhook filter
  if (message.webhookID && message.guild) {
    // waiting embed loading
    await time.wait(5000)

    // twitter
    if (message.content.startsWith("http://twitter.com")) {
      const embed = message.embeds[0]

      if (!embed || /^@\S+/.test(embed.description || "")) {
        await message.delete().catch()
      } else if (embed.author) {
        const tweetUserMatch = /\(@(.+)\)/.exec(String(embed.author.name))
        const tweetUser = tweetUserMatch ? tweetUserMatch[1] : null
        if (
          !tweetUser ||
          Globals.db
            .get(message.guild.id, "authorizedTwitterUsers")
            .every((user: string) => user !== tweetUser)
        ) {
          await message.delete().catch()
        }
      } else {
        await message.delete().catch()
      }
    }
  }
}
