import Command from "../app/Command"
import Globals from "../app/Globals"
import Embed from "../app/Embed"
import Types from "../utils/types"

new Command({
  name: "Prefix Manager",
  regex: /pr[eé]fix/i,
  description: "Change le prefix de Nano pour ce serveur.",
  channelType: "guild",
  admin: true,
  args: [
    {
      reset: {
        type: "reset",
      },
    },
    {
      newPrefix: {
        type: Types.rest,
      },
    },
  ],
  call: async ({ message, args: { reset, newPrefix } }) => {
    if (!message.guild) return

    const embed = new Embed()

    if (reset) newPrefix = Globals.bot.prefix

    Globals.db.set(message.guild.id, newPrefix, "prefix")

    await message.channel.send(
      embed.setTemplate(
        "Success",
        `Le préfixe a bien été modifié sur ce serveur.\nNouveau préfixe: \`${newPrefix}\``
      )
    )
  },
})
