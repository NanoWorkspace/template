import Discord from "discord.js"
import Event from "../../../app/Event"
import ReactionRoleMessage from "../app/ReactionRoleMessage"

new Event({
  name: "messageDelete",
  caller: "on",
  description: "Delete reaction-role message on message delete",
  call: async (message) => {
    ReactionRoleMessage.getByMessage(message as Discord.Message)?.delete()
  },
})

new Event({
  name: "messageReactionAdd",
  caller: "on",
  description: "Give role to member on message reaction add",
  call: async (messageReaction, user) => {
    if (user.bot) return
    const guild = messageReaction.message.guild
    if (guild) {
      const role = await ReactionRoleMessage.fetchRole(guild, messageReaction)
      const member = guild.members.cache.get(user.id)
      if (member && role) await member.roles.add(role).catch()
    }
  },
})

new Event({
  name: "messageReactionRemove",
  caller: "on",
  description: "Remove role from member on message reaction remove",
  call: async (messageReaction, user) => {
    if (user.bot) return
    const guild = messageReaction.message.guild
    if (guild) {
      const role = await ReactionRoleMessage.fetchRole(guild, messageReaction)
      const member = guild.members.cache.get(user.id)
      if (member && role) await member.roles.remove(role).catch()
    }
  },
})

new Event({
  name: "roleDelete",
  caller: "on",
  description: "Remove reaction-role on role delete",
  call: async (role) => {
    for (const [, rrm] of ReactionRoleMessage.getByGuild(role.guild)) {
      for (const reactionRole of rrm.reactionRoles) {
        if (reactionRole.role === role) {
          await rrm.remove(reactionRole.emoji)
        }
      }
      if (rrm.reactionRoles.length === 0) {
        await rrm.delete()
      }
    }
  },
})
