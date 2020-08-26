import Discord from "discord.js"
import Types from "../utils/types"
import Command from "../app/Command"

new Command({
  name: "Reaction Roles Manager",
  pattern: /rr|rero|reaction\s?role/i,
  description: "Gère la création et la suppression de réaction-rôles",
  admin: true,
  channelType: "guild",
  args: [
    {
      create: { type: /create|new|make/i },
      channel: { type: Types.channel },
      messageID: { type: Types.snowflake },
    },
    {
      remove: { type: /de(?:lete)|rm|remove/i },
      reactionRoleID: { type: Types.snowflake },
      emoji: {
        optional: true,
        type: Types.emoji,
      },
    },
    {
      add: { type: /add|react/i },
      reactionRoleID: { type: Types.snowflake },
      emoji: { type: Types.emoji },
    },
  ],
  async call({
    message,
    args: { create, remove, add, channel, messageID, reactionRoleID },
  }) {
    if (create) {
      // todo: use Discord.SnowflakeUtil.generate() to generale reactionRoleID
    } else if (remove) {
    } else if (add) {
    }
  },
})
