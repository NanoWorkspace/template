import Command from "../app/Command"
import Embed from "../app/Embed"

new Command({
  name: "Kick Member",
  pattern: /kick|k/i,
  args: {
    member: { type: Command.types.member },
  },
  permissions: ["KICK_MEMBERS"],
  botPermissions: ["KICK_MEMBERS"],
  description: "Kick a member",
  moderator: true,
  call: async ({ message, args: { member } }) => {
    if (!member)
      return await message.channel.send(
        Embed.error("Vous devez cibler un membre à kick du serveur.")
      )

    await member.kick()

    await message.channel.send(
      Embed.success(`**${member.user.tag}** a été kick.`)
    )
  },
})

new Command({
  name: "Ban Member",
  pattern: /ban/i,
  args: {
    member: { type: Command.types.member },
  },
  permissions: ["BAN_MEMBERS"],
  botPermissions: ["BAN_MEMBERS"],
  description: "Ban a member",
  category: "mod",
  moderator: true,
  call: async ({ message, args: { member } }) => {
    if (!member)
      return await message.channel.send(
        Embed.error("Vous devez cibler un membre à ban du serveur.")
      )

    await member.ban()

    await message.channel.send(
      Embed.success(`**${member.user.tag}** a été ban.`)
    )
  },
})

// todo: Make mute command
