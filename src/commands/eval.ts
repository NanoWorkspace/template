import _Command from "../app/Command"
import _Globals from "../app/Globals"
import _Embed from "../app/Embed"
import Types from "../utils/ArgumentTypes"
import _Text from "../utils/Text"

new _Command({
  name: "Eval JS",
  pattern: /eval|js/i,
  description: "Exécute un bout de code en back-end.",
  botOwner: true,
  args: { code: { type: Types.code } },
  call: async ({ message, args: { code } }) => {
    const { guild, channel, client } = message
    const Embed = _Embed
    const Globals = _Globals
    const Command = _Command
    const Text = _Text
    try {
      let result = await eval(
        `async ({ ${Object.keys(Globals).join(", ")} }) => {${code}}`
      )(Globals)

      if (result !== undefined) {
        await channel.send(Embed.success(Text.code(String(result))))
      } else {
        await channel.send(Embed.success("Le code a bien été exécuté."))
      }
    } catch (error) {
      await channel.send(
        Embed.error(Text.code(error.name + ": " + error.message))
      )
    }
  },
})
