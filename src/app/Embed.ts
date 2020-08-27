import Discord from "discord.js"
import bot from "../globals/bot"
import Logger from "./Logger"

Logger.load("file", __filename)

// todo: use Embed.(error|success) for each embed usage.

export interface EmbedTemplates {
  default: Discord.MessageEmbedOptions
  [k: string]: Discord.MessageEmbedOptions
}

class Embed extends Discord.MessageEmbed {
  static templates = bot.embedTemplates

  static error(description?: string) {
    return new Embed().setTemplate("error", description)
  }
  static success(description?: string) {
    return new Embed().setTemplate("success", description)
  }

  constructor(description?: string) {
    super()
    this.setTemplate("default", description)
  }

  setTemplate(templateName: string, description?: string): Embed {
    const template = Embed.templates[templateName.toLowerCase()]

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
            value.name?.replace(templatingRegex, templatingReplacer),
            // @ts-ignore
            value.iconURL?.replace(templatingRegex, templatingReplacer),
            // @ts-ignore
            value.url
          )
        } else {
          // footer
          this.setFooter(
            // @ts-ignore
            value.text.replace(templatingRegex, templatingReplacer),
            // @ts-ignore
            value.iconURL?.replace(templatingRegex, templatingReplacer)
          )
        }
      }
    })

    if (description) this.setDescription(description)

    return this
  }
}

export default Embed
