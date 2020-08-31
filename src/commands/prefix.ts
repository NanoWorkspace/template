import Command from "../app/Command"
import Globals from "../app/Globals"
import Embed from "../app/Embed"
import Types from "../utils/ArgumentTypes"

new Command({
  name: "Prefix Manager",
  pattern: /pr[eé]fix/i,
  description: `Change le prefix de ${Globals.bot.name} pour ce serveur.`,
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
        type: Types.text,
      },
    },
  ],
  call: async ({ message, args: { reset, newPrefix } }) => {
    if (!message.guild) return

    if (reset) newPrefix = Globals.bot.prefix

    Globals.db.set(message.guild.id, newPrefix, "prefix")

    await message.channel.send(
      Embed.success(
        `Le préfixe a bien été modifié sur ce serveur.\nNouveau préfixe: \`${newPrefix}\``
      )
    )
  },
})
