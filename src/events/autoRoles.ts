import Event from "../app/Event"
import Globals from "../app/Globals"

new Event({
  name: "guildMemberAdd",
  caller: "on",
  description: "Add role auto on member add",
  call: (member) => {
    if (!member.user) return
    const roleList: string[] = Globals.db.get(
      member.guild.id,
      "autoRoles." + (member.user.bot ? "bot" : "user")
    )
    if (roleList.length > 0) {
      member.roles.add(roleList).catch(console.error)
    }
  },
})
