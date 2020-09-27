import Nano from "@ghom/nano-bot"
import Discord from "discord.js"

new Nano.Command({
  id: "messageDeleter",
  name: "Message Deleter",
  pattern: /rm|remove|del(?:ete)?|clea[nr]|purge|prune/,
  description: "Efface un certain nombre de messages dans le salon actuel.",
  category: "admin",
  cooldown: 5000,
  channelType: "guild",
  permissions: ["MANAGE_MESSAGES"],
  args: {
    count: {
      typeName: "[1...99]",
      type: Nano.Utils.ArgumentTypes.numberBetween(1, 99),
    },
  },
  call: async ({ message, args: { count } }) => {
    if (!count)
      return await message.channel.send(
        Nano.Embed.error(
          "Vous devez donner un nombre de messages a effacer entre `1` et `99`."
        )
      )

    await message.delete()

    if (message.channel instanceof Discord.GuildChannel)
      await message.channel.bulkDelete(count)
  },
})
