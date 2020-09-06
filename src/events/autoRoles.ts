import Nano from "nano-bot/src"

new Nano.Event({
  name: "guildMemberAdd",
  caller: "on",
  description: "Add role auto on member add",
  call: (member) => {
    if (!member.user) return
    const roleList: string[] = Nano.Globals.db.get(
      member.guild.id,
      "autoRoles." + (member.user.bot ? "bot" : "user")
    )
    if (roleList.length > 0) {
      member.roles.add(roleList).catch(console.error)
    }
  },
})
