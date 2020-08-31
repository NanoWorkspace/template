import Event from "../app/Event"
import Paginator from "../app/Paginator"

new Event({
  name: "messageReactionAdd",
  caller: "on",
  description: "Trigger paginator on message reaction add",
  call: async (messageReaction, user) => {
    if (user.bot) return
    const message = messageReaction.message
    const guild = message.guild
    if (guild) {
      const paginator = Paginator.getByMessage(message)
      if (paginator) {
        paginator.handleReaction(messageReaction)
      }
    }
  },
})

new Event({
  name: "messageDelete",
  caller: "on",
  description: "Trigger paginator on message reaction add",
  call: async (message) => {
    const guild = message.guild
    if (guild) {
      Paginator.deleteByMessage(message)
    }
  },
})
