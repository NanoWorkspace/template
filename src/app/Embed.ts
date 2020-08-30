import Discord from "discord.js"
import bot from "../globals/bot"
import Logger from "./Logger"

Logger.load("file", __filename)

export interface EmbedTemplates {
  default: Discord.MessageEmbedOptions
  success: Discord.MessageEmbedOptions
  error: Discord.MessageEmbedOptions
  log: Discord.MessageEmbedOptions
  [k: string]: Discord.MessageEmbedOptions
}

class Embed extends Discord.MessageEmbed {
  static templates = bot.embedTemplates || ({} as EmbedTemplates)

  // static byMessageEmbed(embed: Discord.MessageEmbed): Embed {
  //
  // }

  static log(description?: string) {
    return new Embed().setTemplate("log", description)
  }
  static error(description?: string) {
    return new Embed().setTemplate("error", description)
  }
  static success(description?: string) {
    return new Embed().setTemplate("success", description)
  }
  static default(description?: string) {
    return new Embed(description)
  }

  constructor(description?: string) {
    super()
    this.setTemplate("default", description)
  }

  setAuthorName(name: Discord.StringResolvable): this {
    return super.setAuthor(name, this.author?.iconURL, this.author?.url)
  }

  setFooterText(text: Discord.StringResolvable): this {
    return super.setFooter(text, this.footer?.iconURL)
  }

  setTemplate(templateName: string, description?: string): this {
    const template = Embed.templates[templateName.toLowerCase()]

    if (template) {
      const Globals = require("./Globals")
      const templatingRegex = /\{\{\s*(.+)\s*}}/g
      const templatingReplacer = (fm: string, g: string) => eval(g)

      Object.entries(template).forEach(([name, value]) => {
        // @ts-ignore
        const method = this[`set${name[0].toUpperCase() + name.slice(1)}`]

        if (value === null) {
          method.bind(this)()
        } else if (typeof value === "string") {
          method.bind(this)(value.replace(templatingRegex, templatingReplacer))
        } else if (Array.isArray(value)) {
          if (name === "fields") {
            // fields
            value.forEach((field: Discord.EmbedFieldData) => {
              this.addField(
                field.name.replace(templatingRegex, templatingReplacer),
                field.value.replace(templatingRegex, templatingReplacer),
                field.inline
              )
            })
          } else {
            // files
            this.attachFiles(value)
          }
        } else if (value && typeof value === "object") {
          if (name === "author") {
            this.setAuthor(
              // @ts-ignore
              value.name?.replace(templatingRegex, templatingReplacer) ||
                this.author?.name,
              // @ts-ignore
              value.iconURL?.replace(templatingRegex, templatingReplacer) ||
                this.author?.iconURL,
              // @ts-ignore
              value.url || this.author?.url
            )
          } else {
            // footer
            this.setFooter(
              // @ts-ignore
              value.text.replace(templatingRegex, templatingReplacer) ||
                this.footer?.text,
              // @ts-ignore
              value.iconURL?.replace(templatingRegex, templatingReplacer) ||
                this.footer?.iconURL
            )
          }
        }
      })
    }

    if (description) this.setDescription(description)

    return this
  }
}

export default Embed
