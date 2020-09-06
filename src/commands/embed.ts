import Nano from "nano-bot/src"
import Discord from "discord.js"

new Nano.Command({
  name: "Embed Utils",
  pattern: /e(?:mbed)?/i,
  category: "general",
  description: "Gère la création et la décomposition d'embeds.",
  examples: [
    "[Make a JSON embed for copying here as argument](https://leovoel.github.io/embed-visualizer/)",
  ],
  args: [
    {
      embedOptions: {
        type: Nano.Utils.ArgumentTypes.json,
      },
    },
    {
      channel: {
        type: Nano.Utils.ArgumentTypes.channel,
      },
      messageID: {
        type: Nano.Utils.ArgumentTypes.snowflake,
      },
    },
  ],
  async call({ message, args: { embedOptions, channel, messageID } }) {
    if (!message.guild) return

    if (channel && messageID) {
      const gotMessage = await (channel as Discord.TextChannel).messages.fetch(
        messageID
      )
      if (!gotMessage) {
        return await message.channel.send(
          Nano.Embed.error(`Ce message n'existe pas dans le salon ${channel}.`)
        )
      }
      if (gotMessage.embeds.length === 0) {
        return await message.channel.send(
          Nano.Embed.error(`Ce message ne possède pas d'embed...`)
        )
      } else if (gotMessage.embeds.length === 1) {
        await message.channel.send(
          Nano.Embed.success(
            `Voici ci-dessous l'embed de ce message au format JSON.`
          )
        )
      } else {
        await message.channel.send(
          Nano.Embed.success(
            `Voici ci-dessous les \`${gotMessage.embeds.length}\` embeds de ce message au format JSON.`
          )
        )
      }

      for (const gotEmbed of gotMessage.embeds) {
        await message.channel.send(
          Nano.Utils.Text.code(
            JSON.stringify(gotEmbed.toJSON(), null, 2).replace(/`/g, "\\`"),
            "json"
          )
        )
      }
    } else if (embedOptions) {
      try {
        await message.channel.send(new Discord.MessageEmbed(embedOptions))
      } catch (error) {
        await message.channel.send(Nano.Embed.error(error.message))
      }
    } else {
      await message.channel.send(
        Nano.Embed.error(
          "Vous devez écrire ou coller un embed au format JSON.\nSinon ciblez un salon et un message dont vous voulez analyser les embeds."
        )
      )
    }
  },
})
