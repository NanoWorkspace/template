import Discord, { TextChannel } from "discord.js"
import Command from "../app/Command"
import Types from "../utils/types"
import Text from "../utils/text"
import Embed from "../app/Embed"

new Command({
  name: "Embed Utils",
  regex: /e(?:mbed)?/i,
  description: "Gère la création et la décomposition d'embeds.",
  args: {
    embedOptions: Types.json,
    channel: Types.channel,
    messageID: Types.snowflake,
  },
  async call({ message, args: { embedOptions, channel, messageID } }) {
    if (!message.guild) return

    const embed = new Embed()

    if (channel && messageID) {
      const gotMessage = await (channel as TextChannel).messages.fetch(
        messageID
      )
      if (!gotMessage) {
        return await message.channel.send(
          embed.setTemplate(
            "error",
            `Ce message n'existe pas dans le salon ${channel}.`
          )
        )
      }
      if (gotMessage.embeds.length === 0) {
        return await message.channel.send(
          embed.setTemplate("error", `Ce message ne possède pas d'embed...`)
        )
      } else if (gotMessage.embeds.length === 1) {
        await message.channel.send(
          embed.setTemplate(
            "Success",
            `Voici ci-dessous l'embed de ce message au format JSON.`
          )
        )
      } else {
        await message.channel.send(
          embed.setTemplate(
            "Success",
            `Voici ci-dessous les \`${gotMessage.embeds.length}\` embeds de ce message au format JSON.`
          )
        )
      }

      for (const gotEmbed of gotMessage.embeds) {
        await message.channel.send(
          Text.code(JSON.stringify(gotEmbed.toJSON(), null, 2), "json")
        )
      }
    } else if (embedOptions) {
      try {
        await message.channel.send(new Discord.MessageEmbed(embedOptions))
      } catch (error) {
        await message.channel.send(embed.setTemplate("Error", error.message))
      }
    } else {
      await message.channel.send(
        embed.setTemplate(
          "Error",
          "Vous devez écrire ou coller un embed au format JSON.\nSinon ciblez un salon et un message dont vous voulez analyser les embeds."
        )
      )
    }
  },
})
