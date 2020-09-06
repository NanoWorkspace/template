import Nano from "nano-bot/src"

new Nano.Command({
  name: "Eval JS",
  pattern: /eval|js/i,
  description: "Exécute un bout de code en back-end.",
  botOwner: true,
  args: { code: { type: Nano.Utils.ArgumentTypes.code } },
  async call({ message, args: { code } }) {
    const { guild, channel, client } = message
    const embed = new Nano.Embed()
    try {
      let result = await eval(`async () => {${code}}`)()

      if (result !== undefined) {
        await channel.send(
          Nano.Embed.success(Nano.Utils.Text.code(String(result)))
        )
      } else {
        await channel.send(Nano.Embed.success("Le code a bien été exécuté."))
      }
    } catch (error) {
      await channel.send(
        Nano.Embed.error(
          Nano.Utils.Text.code(error.name + ": " + error.message)
        )
      )
    }
  },
})
