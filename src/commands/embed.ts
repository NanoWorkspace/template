import Discord from "discord.js"
import Command from "../app/Command"
import Types from "../utils/ArgumentTypes"
import Text from "../utils/Text"
import Embed from "../app/Embed"

new Command({
  name: "Embed Utils",
  pattern: /e(?:mbed)?/i,
  description: "Gère la création et la décomposition d'embeds.",
  args: [
    {
      embedOptions: {
        type: Types.json,
      },
    },
    {
      channel: {
        type: Types.channel,
      },
      messageID: {
        type: Types.snowflake,
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
          Embed.error(`Ce message n'existe pas dans le salon ${channel}.`)
        )
      }
      if (gotMessage.embeds.length === 0) {
        return await message.channel.send(
          Embed.error(`Ce message ne possède pas d'embed...`)
        )
      } else if (gotMessage.embeds.length === 1) {
        await message.channel.send(
          Embed.success(
            `Voici ci-dessous l'embed de ce message au format JSON.`
          )
        )
      } else {
        await message.channel.send(
          Embed.success(
            `Voici ci-dessous les \`${gotMessage.embeds.length}\` embeds de ce message au format JSON.`
          )
        )
      }

      for (const gotEmbed of gotMessage.embeds) {
        await message.channel.send(
          Text.code(
            JSON.stringify(gotEmbed.toJSON(), null, 2).replace(/`/g, "\\`"),
            "json"
          )
        )
      }
    } else if (embedOptions) {
      try {
        await message.channel.send(new Discord.MessageEmbed(embedOptions))
      } catch (error) {
        await message.channel.send(Embed.error(error.message))
      }
    } else {
      await message.channel.send(
        Embed.error(
          "Vous devez écrire ou coller un embed au format JSON.\nSinon ciblez un salon et un message dont vous voulez analyser les embeds."
        )
      )
    }
  },
})
