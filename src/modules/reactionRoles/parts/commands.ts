import Command from "../../../app/Command"
import Types from "../../../utils/ArgumentTypes"
import Discord from "discord.js"
import Paginator from "../../../app/Paginator"
import Text from "../../../utils/Text"
import Embed from "../../../app/Embed"
import Globals from "../../../app/Globals"
import ReactionRoleMessage from "../app/ReactionRoleMessage"

new Command({
  name: "Reaction-Roles Manager",
  pattern: /rr|rero|reaction[\s-]?role/i,
  description: "Gère la création et la suppression de réaction-rôles",
  admin: true,
  category: "admin",
  channelType: "guild",
  args: [
    {
      create: {
        index: true,
        description: "New reaction-role message",
        type: /create|new|make/i,
      },
      channel: {
        optional: true,
        type: Types.channel,
      },
    },
    {
      remove: {
        index: true,
        description: "Remove RR message or emoji",
        typeName: "[delete,remove]",
        type: /del(?:ete)?|rm|remove/i,
      },
      reactionRoleID: { type: Types.snowflake },
      emoji: {
        optional: true,
        type: Types.emoji,
      },
    },
    {
      add: {
        index: true,
        description: "New reaction-role emoji",
        type: /add|react/i,
      },
      reactionRoleID: { type: Types.snowflake },
      role: { type: Types.role },
      emoji: { type: Types.emoji },
    },
    {
      edit: {
        index: true,
        description: "Edit reaction-role message",
        type: /[eé]dit/i,
      },
      reactionRoleID: { type: Types.snowflake },
      edition: { type: [Types.json, Types.text] },
    },
    {
      list: {
        index: true,
        description: "List reaction-role messages",
        type: /list|ls/i,
      },
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
      edition,
      reactionRoleID,
      list,
    },
  }) {
    if (list) {
      const reactionRoleMessages = ReactionRoleMessage.getByGuild(
        message.guild as Discord.Guild
      )
      const embeds = Paginator.divider<Discord.EmbedFieldData>(
        reactionRoleMessages
          .array()
          .reverse()
          .map((rrm) => {
            return {
              name: `ID: ${rrm.id}`,
              value: Text.code(
                [
                  `Channel name: ${rrm.channel.name}`,
                  `Channel ID: ${rrm.channel.id}`,
                  `Message ID: ${rrm.options.messageID}`,
                  `Reaction roles: ${rrm.reactionRoles.length}`,
                ].join("\n"),
                "yaml"
              ),
              inline: false,
            }
          }),
        4
      ).map((fields, index, all) => {
        return Embed.default(
          `Voici une liste des ${reactionRoleMessages.size} Reaction-Role messages de ce serveur.`
        )
          .setAuthorName("Reaction-Role Manager - List")
          .addFields(fields)
          .setFooterText(`Page: ${index + 1} sur ${all.length}`)
      })
      return new Paginator(embeds, message.channel, (reaction, user) => {
        return user === message.author
      })
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
      if (!edition)
        return await message.channel.send(
          Embed.error(
            "Vous devez entrer le texte qui remplacera la description actuelle du message de réaction-role."
          )
        )

      try {
        await reactionRoleMessage?.edit(edition)
      } catch (error) {
        return await message.channel.send(Embed.error(error.message))
      }
    }
    await message.channel.send(Embed.success())
  },
})
