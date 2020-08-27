import Command from "../app/Command"
import Globals from "../app/Globals"
import Embed from "../app/Embed"

new Command({
  name: "Reset Database",
  pattern: /reset|erase/i,
  description: "Erase the database and restart the bot.",
  botOwner: true,
  call: async ({ message }) => {
    Globals.db.deleteAll()
    await message.channel.send(Embed.success())
    process.exit(0)
  },
})
