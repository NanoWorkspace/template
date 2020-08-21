import { CommandObject } from "../app/Command"
import Globals from "../app/Globals"
import Types from "../app/ArgumentTypes"
import Embed from "../app/Embed"

const prefix: CommandObject = {
  name: "Prefix Manager",
  regex: /pr[eé]fix/i,
  description: "Change le prefix de Nano pour ce serveur",
  channelType: "guild",
  admin: true,
  args: { newPrefix: Types.text },
  call: async ({ message, args: { newPrefix } }) => {
    if (!message.guild) return
    Globals.db.set(message.guild.id, newPrefix, "prefix")
    const embed = new Embed().setTemplate(
      "Success",
      `Le préfixe a bien été modifié sur ce serveur.\nNouveau préfixe: \`${newPrefix}\``
    )
    await message.channel.send(embed)
  },
}

module.exports = prefix
