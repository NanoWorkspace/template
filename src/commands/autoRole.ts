import Nano from "@ghom/nano-bot"

new Nano.Command({
  name: "Auto-role Manager",
  category: "admin",
  pattern: /ar|autorole/i,
  description:
    "Gère l'ajout de rôles automatiques pour les bots et les utilisateurs.",
  channelType: "guild",
  admin: true,
  args: {
    bot: {
      default: false,
      type: Nano.Utils.ArgumentTypes.boolean,
    },
    action: {
      typeName: "[list,add,remove]",
      type: ["list", "add", /rm|remove|del(?:ete)?/i],
    },
    role: {
      optional: true,
      type: Nano.Utils.ArgumentTypes.role,
    },
  },
  call: async ({ message, args: { isBot, actionIndex, role } }) => {
    if (!message.guild) return

    if (actionIndex === 0 && !role) {
      await message.channel.send(Nano.Embed.error("Vous devez cibler un rôle."))
      return
    }

    const type = isBot ? "bot" : "user"

    switch (actionIndex) {
      case 1:
        Nano.Globals.db.push(message.guild.id, role.id, "autoRoles." + type)
        await message.channel.send(
          Nano.Embed.success(
            `Le rôle **${role.name}** a bien été ajouté à la liste des rôles automatiques pour les **${type}s**.`
          )
        )
        break

      case 2:
        Nano.Globals.db.remove(message.guild.id, role.id, "autoRoles." + type)
        await message.channel.send(
          Nano.Embed.success(
            `Le rôle **${role.name}** a bien été retiré de la liste des rôles automatiques pour les **${type}s**.`
          )
        )
        break

      case 0:
        const embed = new Nano.Embed()
          .setTitle(`Liste des rôles automatiques pour les ${type}s`)
          .setDescription(
            Nano.Globals.db
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
          Nano.Embed.error(
            "Vous devez préciser une action entre `add`, `remove` et `list`."
          )
        )
    }
  },
})
