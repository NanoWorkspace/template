import Types from "../utils/ArgumentTypes"
import Command from "../app/Command"
import Embed from "../app/Embed"
import Discord from "discord.js"

new Command({
  name: "Message Deleter",
  pattern: /rm|remove|del(?:ete)?|clea[nr]|purge|prune/,
  description: "Efface un certain nombre de messages dans le salon actuel.",
  cooldown: 5000,
  channelType: "guild",
  permissions: ["MANAGE_MESSAGES"],
  args: { count: { type: Types.numberBetween(1, 99) } },
  call: async ({ message, args: { count } }) => {
    if (!count)
      return await message.channel.send(
        Embed.error(
          "Vous devez donner un nombre de messages a effacer entre `1` et `99`."
        )
      )

    await message.delete()

    if (message.channel instanceof Discord.GuildChannel)
      await message.channel.bulkDelete(count)
  },
})
