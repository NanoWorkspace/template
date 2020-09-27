import Nano from "@ghom/nano-bot"

new Nano.Command({
  id: "webhookFilter",
  name: "Tweet Webhook Filter",
  pattern: /tw(?:eet|itter)?/i,
  description:
    "Gère l'ajout d'utilisateurs dont les tweet webhooks sont autorisés.",
  channelType: "guild",
  category: "admin",
  admin: true,
  args: {
    action: {
      typeName: "[list,add,remove]",
      type: ["list", "add", /rm|remove|del(?:ete)?/i],
    },
    user: {
      optional: true,
      type: Nano.Utils.ArgumentTypes.rest,
    },
  },
  call: async ({ message, args: { actionIndex, user } }) => {
    if (!message.guild) return

    if (!user && actionIndex !== 0) {
      await message.channel.send(
        Nano.Embed.error("Vous devez entrer un num d'utilisateur Twitter.")
      )
      return
    }

    switch (actionIndex) {
      case 1:
        Nano.Globals.db.push(message.guild.id, user, "authorizedTwitterUsers")
        message.channel.send(
          Nano.Embed.success(
            `**${user}** a bien été ajouté à la liste d'utilisateurs dont les tweet sont autorisés.`
          )
        )
        break

      case 2:
        Nano.Globals.db.remove(message.guild.id, user, "authorizedTwitterUsers")
        message.channel.send(
          Nano.Embed.success(
            `**${user}** a bien été retiré de la liste d'utilisateurs dont les tweet sont autorisés.`
          )
        )
        break

      case 0:
        const embed = new Nano.Embed()
          .setTitle("Liste des utilisateurs dont les tweet sont autorisés.")
          .setDescription(
            Nano.Globals.db
              .get(message.guild.id, "authorizedTwitterUsers")
              .join(", ")
              .trim() || "Aucun."
          )
        message.channel.send(embed)
        break

      default:
        message.channel.send(
          Nano.Embed.error(
            "Vous devez préciser une action entre add, remove et list."
          )
        )
    }
  },
})
