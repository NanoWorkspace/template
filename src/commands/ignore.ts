import Discord from "discord.js"
import Command from "../app/Command"
import Embed from "../app/Embed"
import Globals from "../app/Globals"

new Command({
  name: "Ignore Manager",
  pattern: /ign?(?:ore)?/i,
  description: `Gère les utilisateurs et les salons ignorés par ${Globals.bot.name}.`,
  admin: true,
  channelType: "guild",
  args: [
    {
      action: {
        defaultIndex: 0,
        type: ["add", /rm|remove/],
      },
      items: {
        type: Command.types.arrayFrom(
          Command.types.user,
          Command.types.channel
        ),
      },
    },
    {
      list: {
        type: /ls|list/i,
      },
    },
  ],
  call: async ({ message, args: { actionIndex, items, list } }) => {
    const guild = message.guild as Discord.Guild

    if (list) {
      const ignoredChannels = Globals.db.get(
        guild.id,
        "ignoredChannels"
      ) as Discord.TextChannel[]
      const ignoredUsers = Globals.db.get(
        guild.id,
        "ignoredUsers"
      ) as Discord.User[]

      return await message.channel.send(
        Embed.default("Voici la liste des ignorés.")
          .addField("Users", ignoredUsers.join(" "))
          .addField("Channels", ignoredChannels.join(" "))
      )
    }

    for (const item of items) {
      // @ts-ignore
      Globals.db[!!actionIndex ? "remove" : "add"](
        guild.id,
        item.id,
        item instanceof Discord.User ? "ignoredUsers" : "ignoredChannels"
      )
    }

    await message.channel.send(Embed.success())
  },
})
