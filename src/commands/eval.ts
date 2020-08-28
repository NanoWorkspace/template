import Command from "../app/Command"
import Embed from "../app/Embed"
const Globals = require("../app/Globals")
const Types = require("../utils/ArgumentTypes")
const Text = require("../utils/Text")

new Command({
  name: "Eval JS",
  pattern: /eval|js/i,
  description: "Exécute un bout de code en back-end.",
  botOwner: true,
  args: { code: { type: Types.code } },
  async call({ message, args: { code } }) {
    const { guild, channel, client } = message
    const embed = new Embed()
    try {
      let result = await eval(`async () => {${code}}`)()

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
