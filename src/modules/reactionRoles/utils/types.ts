import Discord from "discord.js"
import Enmap from "enmap"

export interface ReactionRoleOptions {
  roleID: string
  emojiID: string
}

export interface ReactionRoleMessageOptions {
  id: string
  channelID: string
  messageID: string
  reactionRoles: ReactionRoleOptions[]
}

export type ReactionRoleMessageData = Enmap<
  Discord.Snowflake,
  { [k: string]: ReactionRoleMessageOptions }
>
