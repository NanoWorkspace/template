import Command from "../app/Command"
import Globals from "../app/Globals"
import Embed from "../app/Embed"
import Types from "../utils/ArgumentTypes"
import Text from "../utils/Text"

new Command({
  name: "Eval JS",
  pattern: /eval|js/i,
  description: "Exécute un bout de code en back-end.",
  botOwner: true,
  args: { code: { type: Types.code } },
  call: async ({ message, args: { code } }) => {
    const { guild, channel, client } = message
    const embed = new Embed()

    try {
      let result = await eval(
        `async ({ ${Object.keys(Globals).join(", ")} }) => {${code}}`
      )(Globals)

      if (result !== undefined) {
        await channel.send(
          embed.setTemplate("success", Text.code(String(result)))
        )
      } else {
        await channel.send(
          embed.setTemplate("Success", "Le code a bien été exécuté.")
        )
      }
    } catch (error) {
      await channel.send(embed.setTemplate("error", Text.code(error.message)))
    }
  },
})
