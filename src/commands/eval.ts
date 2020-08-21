import { CommandObject } from "../app/Command"
import Globals from "../app/Globals"
import Types from "../app/ArgumentTypes"
import Embed from "../app/Embed"
import text from "../utils/text"

const evalCommand: CommandObject = {
  name: "Eval JS",
  regex: /eval|js/i,
  description: "Exécute un bout de code en back-end.",
  users: ["352176756922253321"],
  args: { code: Types.text },
  call: async ({ message, args: { code } }) => {
    const { guild, channel, client } = message
    const embed = new Embed()

    try {
      let result = await eval(
        `async ({ ${Object.keys(Globals).join(", ")} }) => {${code}}`
      )(Globals)

      if (result !== undefined) {
        await channel.send(
          embed.setTemplate("success", text.code(String(result)))
        )
      } else {
        await channel.send(
          embed.setTemplate("Success", "Le code a bien été exécuté.")
        )
      }
    } catch (error) {
      await channel.send(embed.setTemplate("error", text.code(error.message)))
    }
  },
}

module.exports = evalCommand
