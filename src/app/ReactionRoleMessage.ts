import Discord from "discord.js"
import Globals from "./Globals"

export interface ReactionRoleMessageOptions {
  id: string
  channelID: string
  messageID: string
  reactionRoles: ReactionRoleOptions[]
}

export interface ReactionRoleOptions {
  roleID: string
  emojiID: string
}

export default class ReactionRoleMessage {
  id: Discord.Snowflake
  channel: Discord.TextChannel
  fetchMessage: (cache?: boolean) => Promise<Discord.Message>
  reactionRoles: ReactionRole[]
  guild: Discord.Guild

  constructor(public options: ReactionRoleMessageOptions) {
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

  get key(): string {
    return ReactionRoleMessage.keyFromID(this.id)
  }

  async edit(text: string) {
    const message = await this.fetchMessage()
    const embed = new Discord.MessageEmbed(message.embeds[0].toJSON())
    embed.setDescription(text)
    await message.edit(embed)
  }

  async add(emoji: Discord.EmojiResolvable, role: Discord.Role) {
    const options: ReactionRoleOptions = {
      roleID: role.id,
      emojiID: ReactionRoleMessage.emojiToID(emoji),
    }
    Globals.db.push(this.guild.id, options, `${this.key}.reactionRoles`)
    this.reactionRoles.push(new ReactionRole(options, this))
  }

  async remove(emoji: Discord.EmojiResolvable) {
    const message = await this.fetchMessage()
    const emojiID = ReactionRoleMessage.emojiToID(emoji)
    Globals.db.remove(
      this.guild.id,
      (value: ReactionRoleOptions) => {
        return value.emojiID === emojiID
      },
      `${this.key}.reactionRoles`
    )
    this.reactionRoles = this.reactionRoles.filter((rr) => rr.emoji !== emoji)
    await message.reactions.cache.get(emojiID)?.remove()
  }

  async delete() {
    const message = await this.fetchMessage()
    Globals.db.delete(this.guild.id, this.key)
    await message.delete()
  }

  static get(
    guild: Discord.Guild,
    id: Discord.Snowflake
  ): ReactionRoleMessage | null {
    const options = Globals.db.get(guild.id, ReactionRoleMessage.keyFromID(id))
    return options ? new ReactionRoleMessage(options) : null
  }

  static set(guild: Discord.Guild, options: ReactionRoleMessageOptions) {
    Globals.db.set(guild.id, options, ReactionRoleMessage.keyFromID(options.id))
  }

  static collection(
    guild: Discord.Guild
  ): Discord.Collection<Discord.Snowflake, ReactionRoleMessage> {
    const data = Globals.db.get(guild.id, "reactionRoleMessages")
    const collection: Discord.Collection<
      Discord.Snowflake,
      ReactionRoleMessage
    > = new Discord.Collection()
    for (const id in data) {
      collection.set(id, new ReactionRoleMessage(data[id]))
    }
    return collection
  }

  static async fetchRole(
    guild: Discord.Guild,
    messageReaction: Discord.MessageReaction
  ): Promise<Discord.Role | null> {
    const reactionRoleMessages = ReactionRoleMessage.collection(guild)
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

  static keyFromID(id: Discord.Snowflake) {
    return `reactionRoleMessages.${id}`
  }

  static emojiToID(emoji: Discord.EmojiResolvable): string {
    return emoji instanceof Discord.Emoji ? emoji.id || emoji.name : emoji
  }
}

export class ReactionRole {
  role: Discord.Role
  emoji: Discord.EmojiResolvable

  constructor(
    public options: ReactionRoleOptions,
    public reactionRoleMessage: ReactionRoleMessage
  ) {
    this.role = reactionRoleMessage.channel.guild.roles.cache.get(
      options.roleID
    ) as Discord.Role
    this.emoji =
      Globals.client.emojis.cache.get(options.emojiID) || options.emojiID
  }
}
