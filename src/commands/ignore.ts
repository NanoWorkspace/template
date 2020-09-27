import Nano from "@ghom/nano-bot"
import Discord from "discord.js"

new Nano.Command({
  id: "ignore",
  name: "Ignore Manager",
  pattern: /ign?(?:ore)?/i,
  description: `Gère les utilisateurs et les salons ignorés par ${Nano.Globals.bot.name}.`,
  admin: true,
  category: "admin",
  channelType: "guild",
  args: [
    {
      action: {
        defaultIndex: 0,
        typeName: "[add,remove]",
        type: ["add", /rm|remove/],
      },
      items: {
        typeName: "...[user,channel]",
        type: Nano.Utils.ArgumentTypes.arrayFrom(
          Nano.Utils.ArgumentTypes.user,
          Nano.Utils.ArgumentTypes.channel
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
      const ignoredChannels = Nano.Globals.db.get(
        guild.id,
        "ignoredChannels"
      ) as Discord.TextChannel[]
      const ignoredUsers = Nano.Globals.db.get(
        guild.id,
        "ignoredUsers"
      ) as Discord.User[]

      return await message.channel.send(
        Nano.Embed.default("Voici la liste des ignorés.")
          .addField("Users", ignoredUsers.join(" "))
          .addField("Channels", ignoredChannels.join(" "))
      )
    }

    for (const item of items) {
      // @ts-ignore
      Globals.db[!!actionIndex ? "remove" : "push"](
        guild.id,
        item.id,
        item instanceof Discord.User ? "ignoredUsers" : "ignoredChannels"
      )
    }

    await message.channel.send(Nano.Embed.success())
  },
})
