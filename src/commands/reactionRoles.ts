import Discord from "discord.js"
import Types from "../utils/ArgumentTypes"
import Command from "../app/Command"
import Embed from "../app/Embed"
import ReactionRoleMessage from "../app/ReactionRoleMessage"
import Globals from "../app/Globals"

new Command({
  name: "Reaction-Roles Manager",
  pattern: /rr|rero|reaction[\s-]?role/i,
  description: "Gère la création et la suppression de réaction-rôles",
  admin: true,
  channelType: "guild",
  args: [
    {
      create: { type: /create|new|make/i },
      channel: {
        optional: true,
        type: Types.channel,
      },
    },
    {
      remove: { type: /del(?:ete)?|rm|remove/i },
      reactionRoleID: { type: Types.snowflake },
      emoji: {
        optional: true,
        type: Types.emoji,
      },
    },
    {
      add: { type: /add|react/i },
      reactionRoleID: { type: Types.snowflake },
      role: { type: Types.role },
      emoji: { type: Types.emoji },
    },
    {
      edit: { type: /[eé]dit/i },
      reactionRoleID: { type: Types.snowflake },
      text: { type: Types.text },
    },
  ],
  async call({
    message,
    args: {
      create,
      remove,
      add,
      channel,
      role,
      edit,
      emoji,
      text,
      reactionRoleID,
    },
  }) {
    if (!create && !remove && !add && !edit) {
      return await message.channel.send(
        Embed.error(
          "Vous devez renseigner une action parmi les quatre possibles."
        )
      )
    }

    let reactionRoleMessage: ReactionRoleMessage | null = null

    if (reactionRoleID) {
      reactionRoleMessage = ReactionRoleMessage.get(
        message.guild as Discord.Guild,
        reactionRoleID
      ) as ReactionRoleMessage

      if (!reactionRoleMessage)
        return await message.channel.send(
          Embed.error("reactionRoleID inconnu.")
        )
    }

    if (create) {
      const id = Discord.SnowflakeUtil.generate()
      const prefix = Globals.db.get(message.guild?.id as string, "prefix")
      const embed = new Embed(
        `Faites la commande \`${prefix}rero edit ${id} "texte"\` pour ajouter du texte.`
      )
        .setTitle("Reaction-Roles System")
        .setFooter("Reaction-role message ID: " + id)

      const msg = channel
        ? await channel.send(embed)
        : await message.channel.send(embed)

      ReactionRoleMessage.set(message.guild as Discord.Guild, {
        id,
        channelID: msg.channel.id,
        messageID: msg.id,
        reactionRoles: [],
      })
    } else if (remove) {
      if (emoji) {
        // remove reactionRole
        await reactionRoleMessage?.remove(emoji)
      } else {
        // remove reactionRoleMessage
        await reactionRoleMessage?.delete()
      }
    } else if (add) {
      await reactionRoleMessage?.add(emoji, role)
    } else if (edit) {
      if (!text)
        return await message.channel.send(
          Embed.error(
            "Vous devez entrer le texte qui replacera la description actuelle du message de réaction-role."
          )
        )

      await reactionRoleMessage?.edit(text)
    }
    await message.channel.send(Embed.success())
  },
})
