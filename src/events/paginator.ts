import Nano from "@ghom/nano-bot"

new Nano.Event({
  name: "messageReactionAdd",
  caller: "on",
  description: "Trigger paginator on message reaction add",
  call: async (messageReaction, user) => {
    if (user.bot) return
    const message = messageReaction.message
    const guild = message.guild
    if (guild) {
      const paginator = Nano.Paginator.getByMessage(message)
      if (paginator) {
        paginator.handleReaction(messageReaction, user)
      }
    }
  },
})

new Nano.Event({
  name: "messageDelete",
  caller: "on",
  description: "Trigger paginator on message reaction add",
  call: async (message) => {
    const guild = message.guild
    if (guild) {
      Nano.Paginator.deleteByMessage(message)
    }
  },
})
