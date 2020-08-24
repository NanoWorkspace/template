import Types from "../utils/types"
import Command from "../app/Command"
import Embed from "../app/Embed"
import Discord from "discord.js"

new Command({
  name: "Message Deleter",
  regex: /rm|remove|del(?:ete)?|clea[nr]|purge|prune/,
  description: "Efface un certain nombre de messages dans le salon actuel.",
  cooldown: 5000,
  channelType: "guild",
  permissions: ["MANAGE_MESSAGES"],
  args: { count: Types.number },
  call: async ({ message, args: { count } }) => {
    const embed = new Embed()

    if (count === null)
      return await message.channel.send(
        embed.setTemplate(
          "error",
          "Vous devez donner un nombre de messages a effacer."
        )
      )

    if (count < 1)
      return await message.channel.send(
        embed.setTemplate(
          "error",
          "Votre nombre de message à effacer doit être positif."
        )
      )

    if (count > 99) count = 99

    await message.delete()

    if (message.channel instanceof Discord.GuildChannel)
      await message.channel.bulkDelete(count)
  },
})
