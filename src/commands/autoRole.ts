import Globals from "../app/Globals"
import Embed from "../app/Embed"
import Command from "../app/Command"
import Types from "../utils/types"

new Command({
  name: "Auto-role Manager",
  pattern: /ar|autorole/i,
  description:
    "Gère l'ajout de rôles automatiques pour les bots et les utilisateurs.",
  channelType: "guild",
  admin: true,
  args: {
    bot: {
      default: false,
      type: Types.boolean,
    },
    action: {
      type: ["list", "add", /rm|remove|del(?:ete)?/i],
    },
    role: {
      optional: true,
      type: Types.role,
    },
  },
  call: async ({ message, args: { isBot, actionIndex, role } }) => {
    if (!message.guild) return

    const embed = new Embed()

    if (actionIndex === 0 && !role) {
      await message.channel.send(
        embed.setTemplate("Error", "Vous devez cibler un rôle.")
      )
      return
    }

    const type = isBot ? "bot" : "user"

    switch (actionIndex) {
      case 1:
        Globals.db.push(message.guild.id, role.id, "autoRoles." + type)
        await message.channel.send(
          embed.setTemplate(
            "Success",
            `Le rôle **${role.name}** a bien été ajouté à la liste des rôles automatiques pour les **${type}s**.`
          )
        )
        break

      case 2:
        Globals.db.remove(message.guild.id, role.id, "autoRoles." + type)
        await message.channel.send(
          embed.setTemplate(
            "Success",
            `Le rôle **${role.name}** a bien été retiré de la liste des rôles automatiques pour les **${type}s**.`
          )
        )
        break

      case 0:
        embed
          .setTitle(`Liste des rôles automatiques pour les ${type}s`)
          .setDescription(
            Globals.db
              .get(message.guild.id, "autoRoles." + type)
              .map((r: string) => {
                return message.guild?.roles.resolve(r)?.toString()
              })
              .join(" ")
              .trim() || "Aucun."
          )
        await message.channel.send(embed)
        break

      default:
        await message.channel.send(
          embed.setTemplate(
            "Error",
            "Vous devez préciser une action entre `add`, `remove` et `list`."
          )
        )
    }
  },
})
