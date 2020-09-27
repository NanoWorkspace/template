import Nano from "@ghom/nano-bot"

new Nano.Command({
  id: "kick",
  name: "Kick Member",
  pattern: /kick|k/i,
  args: {
    member: { type: Nano.Utils.ArgumentTypes.member },
  },
  permissions: ["KICK_MEMBERS"],
  botPermissions: ["KICK_MEMBERS"],
  description: "Kick a member",
  moderator: true,
  call: async ({ message, args: { member } }) => {
    if (!member)
      return await message.channel.send(
        Nano.Embed.error("Vous devez cibler un membre à kick du serveur.")
      )

    await member.kick()

    await message.channel.send(
      Nano.Embed.success(`**${member.user.tag}** a été kick.`)
    )
  },
})

new Nano.Command({
  id: "ban",
  name: "Ban Member",
  pattern: /ban/i,
  args: {
    member: { type: Nano.Utils.ArgumentTypes.member },
  },
  permissions: ["BAN_MEMBERS"],
  botPermissions: ["BAN_MEMBERS"],
  description: "Ban a member",
  category: "mod",
  moderator: true,
  call: async ({ message, args: { member } }) => {
    if (!member)
      return await message.channel.send(
        Nano.Embed.error("Vous devez cibler un membre à ban du serveur.")
      )

    await member.ban()

    await message.channel.send(
      Nano.Embed.success(`**${member.user.tag}** a été ban.`)
    )
  },
})

// todo: Make mute command
