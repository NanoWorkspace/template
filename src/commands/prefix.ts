import Nano from "nano-bot/src"

new Nano.Command({
  name: "Prefix Manager",
  pattern: /pr[eé]fix/i,
  description: `Change le prefix de ${Nano.Globals.bot.name} pour ce serveur.`,
  channelType: "guild",
  category: "admin",
  admin: true,
  args: [
    {
      reset: {
        type: "reset",
      },
    },
    {
      newPrefix: {
        type: Nano.Utils.ArgumentTypes.text,
      },
    },
  ],
  call: async ({ message, args: { reset, newPrefix } }) => {
    if (!message.guild) return

    if (reset) newPrefix = Nano.Globals.bot.prefix

    Nano.Globals.db.set(message.guild.id, newPrefix, "prefix")

    await message.channel.send(
      Nano.Embed.success(
        `Le préfixe a bien été modifié sur ce serveur.\nNouveau préfixe: \`${newPrefix}\``
      )
    )
  },
})
