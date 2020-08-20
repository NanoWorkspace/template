import Discord from "discord.js"
import { CommandObject } from "../app/Command"
import Globals from "../app/Globals"
import Types from "../app/ArgumentTypes"
import Embed from "../app/Embed"
import text from "../utils/text"

const help: CommandObject = {
  name: "Help Menu",
  regex: /h(?:[aeu]?lp)?/i,
  description: "Affiche les commandes existantes",
  channelType: "guild",
  args: { command: Types.command },
  call: async ({ message, args }) => {
    const command: CommandObject = args.command

    const embed = new Embed()

    if (!command) {
      embed.setTitle("Commandes").addFields(
        Globals.commands.map((c) => ({
          name: c.name,
          value: c.description || "Pas de description",
        }))
      )
    } else {
      if (command) {
        embed
          .setTitle(command.name)
          .setDescription(command.description || "Pas de description")
          .addField("pattern:", text.code(command.regex.toString()), false)
        if (command.args)
          embed.addField(
            "arguments:",
            Object.keys(command.args).join(", "),
            true
          )
        if (command.examples)
          embed.addField("examples:", command.examples.join("\n"), true)
        if (command.owner) embed.addField("owner:", true, true)
        if (command.admin) embed.addField("admin:", true, true)
        if (command.permissions)
          embed.addField(
            "permissions:",
            text.code(command.permissions.join("\n")),
            true
          )
        if (command.users)
          embed.addField(
            "users:",
            command.users
              .map((user) => `<@${(user as Discord.User).id || user}>`)
              .join("\n"),
            true
          )
        if (command.channelType)
          embed.addField("channelType:", command.channelType, true)
        if (command.cooldown)
          embed.addField("cooldown:", `${command.cooldown} ms`, true)
        if (command.typing) embed.addField("typing:", true, true)
        if (command.examples)
          embed.addField(
            "examples:",
            command.examples
              .map((example) => text.code(example, "md"))
              .join(""),
            true
          )
      }
    }

    await message.channel.send(embed)
  },
}

module.exports = help
