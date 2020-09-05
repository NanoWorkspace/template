import Discord from "discord.js"
import Globals from "../../../app/Globals"
import ReactionRoleMessage from "./ReactionRoleMessage"

import * as types from "../utils/types"

export default class ReactionRole {
  role: Discord.Role
  emoji: Discord.EmojiResolvable

  constructor(
    public options: types.ReactionRoleOptions,
    public reactionRoleMessage: ReactionRoleMessage
  ) {
    this.role = reactionRoleMessage.channel.guild.roles.cache.get(
      options.roleID
    ) as Discord.Role
    this.emoji =
      Globals.client.emojis.cache.get(options.emojiID) || options.emojiID
  }
}
