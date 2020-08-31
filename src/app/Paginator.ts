import Events from "events"
import Discord, { MessageReaction } from "discord.js"

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
   * @param {TextChannel} channel - Channel where send the paginator message
   * @param {Function} filter - Used to filter what reactionMessage is valid
   * @param {number} idlTime - Time between last action and paginator deactivation in milliseconds. (default: 1 min)
   * @param {Partial<PaginatorEmojis>} customEmojis - Custom emojis to overwrite
   */
  constructor(
    public pages: (Discord.MessageEmbed | string)[],
    public channel: Discord.TextChannel,
    public filter: (reaction: MessageReaction) => boolean,
    private idlTime: number = 60000,
    customEmojis?: Partial<PaginatorEmojis>
  ) {
    super()
    if (idlTime) this.idlTime = idlTime
    if (customEmojis) {
      Object.assign(this.emojis, customEmojis)
    }
    this.deactivation = this.resetDeactivation()
    channel.send(this.currentPage).then((message) => {
      this.messageID = message.id
    })
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

  handleReaction(reaction: MessageReaction) {
    if (!this.filter(reaction)) return
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
          this.refresh()
          break
        case "end":
          this.pageIndex = this.pages.length - 1
          this.refresh()
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
      clearTimeout(this.deactivation)
      this.deactivation = this.resetDeactivation()
    }
  }

  resetDeactivation() {
    return setTimeout(async () => {
      if (!this.messageID) return
      const message = await this.channel.messages.fetch(this.messageID)
      if (message) Paginator.deleteByMessage(message)
    }, this.idlTime)
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
}
