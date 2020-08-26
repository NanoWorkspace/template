import Event from "../app/Event"

new Event<"messageReactionAdd">({
  name: "messageReactionAdd",
  caller: "on",
  description: "Give a role to a member on message reaction add",
  call: async (messageReaction, user) => {},
})

new Event<"messageReactionRemove">({
  name: "messageReactionRemove",
  caller: "on",
  description: "Remove a role from a member on message reaction remove",
  call: async (messageReaction, user) => {},
})
