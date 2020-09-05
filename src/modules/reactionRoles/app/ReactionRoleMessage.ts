import ReactionRole from "./ReactionRole"
import Discord from "discord.js"
import Globals from "../../../app/Globals"
import db from "../utils/db"

import * as types from "../utils/types"

export default class ReactionRoleMessage {
  id: Discord.Snowflake
  channel: Discord.TextChannel
  fetchMessage: (cache?: boolean) => Promise<Discord.Message>
  reactionRoles: ReactionRole[]
  guild: Discord.Guild

  constructor(public options: types.ReactionRoleMessageOptions) {
    this.id = options.id
    this.channel = Globals.client.channels.cache.get(
      options.channelID
    ) as Discord.TextChannel
    this.fetchMessage = (cache = true) =>
      this.channel.messages.fetch(options.messageID, true)
    this.reactionRoles = options.reactionRoles.map(
      (rr) => new ReactionRole(rr, this)
    )
    this.guild = this.channel.guild
  }

  async edit(value: string | Discord.MessageEmbedOptions) {
    const message = await this.fetchMessage()
    let embed: Discord.MessageEmbed
    if (typeof value === "string") {
      embed = new Discord.MessageEmbed(message.embeds[0].toJSON())
      embed.setDescription(value)
    } else {
      embed = new Discord.MessageEmbed(value)
      embed.setFooter(message.embeds[0].footer?.text)
    }
    await message.edit(embed)
  }

  async add(emoji: Discord.EmojiResolvable, role: Discord.Role) {
    const message = await this.fetchMessage(true)
    const options: types.ReactionRoleOptions = {
      roleID: role.id,
      emojiID: ReactionRoleMessage.emojiToID(emoji),
    }
    db.push(this.guild.id, options, `${this.id}.reactionRoles`)
    this.reactionRoles.push(new ReactionRole(options, this))
    await message.react(emoji)
  }

  async remove(emoji: Discord.EmojiResolvable) {
    const message = await this.fetchMessage()
    const emojiID = ReactionRoleMessage.emojiToID(emoji)
    db.remove(
      this.guild.id,
      // @ts-ignore
      (value: types.ReactionRoleOptions) => {
        return value.emojiID === emojiID
      },
      `${this.id}.reactionRoles`
    )
    this.reactionRoles = this.reactionRoles.filter((rr) => rr.emoji !== emoji)
    await message.reactions.cache.get(emojiID)?.remove()
  }

  async delete() {
    const message = await this.fetchMessage()
    db.delete(this.guild.id, this.id)
    await message.delete()
  }

  static get(
    guild: Discord.Guild,
    id: Discord.Snowflake
  ): ReactionRoleMessage | null {
    const options = db.get(guild.id, id)
    return options ? new ReactionRoleMessage(options as any) : null
  }

  static async set(
    guild: Discord.Guild,
    options: types.ReactionRoleMessageOptions
  ) {
    db.set(guild.id, options, options.id)
    const channel = Globals.client.channels.cache.get(
      options.channelID
    ) as Discord.TextChannel
    const message = await channel.messages.fetch(options.messageID)
    for (const rro of options.reactionRoles) {
      await message.react(rro.emojiID)
    }
  }

  static getByGuild(
    guild: Discord.Guild
  ): Discord.Collection<Discord.Snowflake, ReactionRoleMessage> {
    const data = db.get(guild.id)
    const collection: Discord.Collection<
      Discord.Snowflake,
      ReactionRoleMessage
    > = new Discord.Collection()
    for (const id in data) {
      collection.set(id, new ReactionRoleMessage(data[id]))
    }
    return collection
  }

  static getByMessage(
    message: Discord.Message
  ): ReactionRoleMessage | undefined {
    if (!message.guild) return undefined
    return this.getByGuild(message.guild).find((rrm) => {
      return rrm.options.messageID === message.id
    })
  }

  static async fetchRole(
    guild: Discord.Guild,
    messageReaction: Discord.MessageReaction
  ): Promise<Discord.Role | null> {
    const reactionRoleMessages = ReactionRoleMessage.getByGuild(guild)
    for (const reactionRoleMessage of reactionRoleMessages.array()) {
      const message = await reactionRoleMessage.fetchMessage(false)
      if (message.id === messageReaction.message.id) {
        const reactionRoles = reactionRoleMessage.reactionRoles
        for (const reactionRole of reactionRoles) {
          if (
            ReactionRoleMessage.emojiToID(reactionRole.emoji) ===
            ReactionRoleMessage.emojiToID(messageReaction.emoji)
          ) {
            return reactionRole.role
          }
        }
      }
    }
    return null
  }

  static emojiToID(emoji: Discord.EmojiResolvable): string {
    return emoji instanceof Discord.Emoji ? emoji.id || emoji.name : emoji
  }
}
