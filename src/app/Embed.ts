const { bot } = require("../../package.json")

import Discord from "discord.js"
import globals from "./Globals"

interface Templates {
  default: Discord.MessageEmbedOptions
  [k: string]: Discord.MessageEmbedOptions
}

export default class Embed extends Discord.MessageEmbed {
  static templates: Templates = bot.embedTemplates

  constructor() {
    super()
    this.setTemplate("default")
  }

  setTemplate(templateName: string, description?: string): Embed {
    const Globals = globals
    const template = Embed.templates[templateName.toLowerCase()]

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
      } else if (typeof value === "object") {
        if (name === "author") {
          this.setAuthor(
            value.name?.replace(templatingRegex, templatingReplacer),
            value.iconURL?.replace(templatingRegex, templatingReplacer),
            value.url
          )
        } else {
          // footer
          this.setFooter(
            value.text.replace(templatingRegex, templatingReplacer),
            value.iconURL?.replace(templatingRegex, templatingReplacer)
          )
        }
      }
    })

    if (description) this.setDescription(description)

    return this
  }
}
