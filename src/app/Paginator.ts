import Events from "events"
import Discord from "discord.js"

/** As Snowflakes or icons */
export interface PaginatorEmojis {
  previous: string
  next: string
  start: string
  end: string
}

export default class Paginator extends Events.EventEmitter {
  static paginations: Paginator[] = []

  private pageIndex = 0
  private deactivation: NodeJS.Timeout
  messageID: string | undefined
  emojis: PaginatorEmojis = {
    previous: "◀️",
    next: "▶️",
    start: "⏪",
    end: "⏩",
  }

  /**
   * @constructor
   * @param pages - Array of pages
   * @param {TextChannel | DMChannel | NewsChannel} channel - Channel where send the paginator message
   * @param {Function} filter - Used to filter what reactionMessage is valid
   * @param {number} idlTime - Time between last action and paginator deactivation in milliseconds. (default: 1 min)
   * @param {Partial<PaginatorEmojis>} customEmojis - Custom emojis to overwrite
   */
  constructor(
    public pages: (Discord.MessageEmbed | string)[],
    public channel:
      | Discord.TextChannel
      | Discord.DMChannel
      | Discord.NewsChannel,
    public filter: (
      reaction: Discord.MessageReaction,
      user: Discord.User | Discord.PartialUser
    ) => boolean,
    public idlTime: number = 60000,
    customEmojis?: Partial<PaginatorEmojis>
  ) {
    super()
    if (idlTime) this.idlTime = idlTime
    if (customEmojis) {
      Object.assign(this.emojis, customEmojis)
    }
    this.deactivation = this.resetDeactivation()
    channel.send(this.currentPage).then(async (message) => {
      this.messageID = message.id
      for (const key of ["start", "previous", "next", "end"]) {
        await message.react(this.emojis[key as keyof PaginatorEmojis])
      }
    })
    Paginator.paginations.push(this)
  }

  get currentPage(): Discord.MessageEmbed | string {
    return this.pages[this.pageIndex]
  }

  refresh() {
    if (this.messageID) {
      this.channel.messages
        .fetch(this.messageID)
        .then((message) => {
          message.edit(this.currentPage).catch()
        })
        .catch()
    }
  }

  handleReaction(
    reaction: Discord.MessageReaction,
    user: Discord.User | Discord.PartialUser
  ) {
    if (!this.filter(reaction, user)) return
    const { emoji } = reaction
    const emojiID = emoji.id || emoji.name
    let currentKey: keyof PaginatorEmojis | null = null
    for (const key in this.emojis) {
      if (this.emojis[key as keyof PaginatorEmojis] === emojiID) {
        currentKey = key as keyof PaginatorEmojis
      }
    }
    if (currentKey) {
      switch (currentKey) {
        case "start":
          this.pageIndex = 0
          break
        case "end":
          this.pageIndex = this.pages.length - 1
          break
        case "next":
          this.pageIndex++
          if (this.pageIndex > this.pages.length - 1) {
            this.pageIndex = 0
          }
          break
        case "previous":
          this.pageIndex--
          if (this.pageIndex < 0) {
            this.pageIndex = this.pages.length - 1
          }
      }
      this.refresh()
      clearTimeout(this.deactivation)
      this.deactivation = this.resetDeactivation()
      reaction.users.remove(user as Discord.User).catch()
    }
  }

  resetDeactivation() {
    return setTimeout(() => this.deactivate().catch(), this.idlTime)
  }

  async deactivate() {
    if (!this.messageID) return
    const message = await this.channel.messages.fetch(this.messageID)
    if (message) {
      await message.reactions.removeAll()
      Paginator.deleteByMessage(message)
    }
  }

  static getByMessage(message: Discord.Message): Paginator | undefined {
    return this.paginations.find((paginator) => {
      return paginator.messageID === message.id
    })
  }

  static deleteByMessage(message: Discord.Message | Discord.PartialMessage) {
    this.paginations = this.paginations.filter((paginator) => {
      return paginator.messageID !== message.id
    })
  }

  static divider<T>(items: T[], itemCountByDivision: number): T[][] {
    const divided: T[][] = []
    const divisionCount = Math.ceil(items.length / itemCountByDivision)
    for (let i = 0; i < divisionCount; i++) {
      divided.push(
        items.slice(itemCountByDivision * i, itemCountByDivision * (i + 1))
      )
    }
    return divided
  }
}
