import Nano from "@ghom/nano-bot"

new Nano.Command({
  name: "Reset Database",
  pattern: /reset|erase/i,
  description: "Erase the database and restart the bot.",
  botOwner: true,
  call: async ({ message }) => {
    Nano.Globals.db.deleteAll()
    await message.channel.send(Nano.Embed.success())
    process.exit(0)
  },
})
