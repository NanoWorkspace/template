import Discord from "discord.js"
import Globals from "../app/Globals"
import Command, { CommandArgumentGroup } from "../app/Command"
import Embed from "../app/Embed"
import Types from "../utils/ArgumentTypes"
import Text from "../utils/Text"

new Command({
  name: "Help Menu",
  pattern: /h(?:[aeu]?lp)?/i,
  description: "Affiche les commandes existantes.",
  args: { command: { type: Types.command, optional: true } },
  call: async ({ message, args }) => {
    const command: Command = args.command

    const embed = new Embed()

    if (!command) {
      embed.setTitle("Commandes").addFields(
        (Globals.bot.owners.has(message.author.id)
          ? Command.commands
          : Command.commands.filter((c) => !c.botOwner)
        ).map((c) => ({
          name: c.name,
          value: c.description || "Pas de description",
        }))
      )
    } else {
      if (command) {
        embed
          .setTitle(command.name)
          .setDescription(command.description || "Pas de description")
          .addField(
            "pattern:",
            Text.code(command.originalPattern.toString()),
            false
          )

        if (command.args) {
          function getKeyOf(value: any, object: any): string | null {
            for (const key in object) {
              if (object[key] === value) {
                return key
              }
            }
            return null
          }

          function groupToString(group: CommandArgumentGroup) {
            return Object.keys(group)
              .map((name) => {
                const arg = group[name]
                const hooks: boolean =
                  arg.optional ||
                  arg.default !== undefined ||
                  arg.defaultIndex !== undefined
                return `- ${hooks ? "[" : ""}${name}: ${
                  arg.typeName ||
                  (typeof arg.type === "function"
                    ? getKeyOf(arg.type, Types) || "?"
                    : Array.isArray(arg.type)
                    ? "enum"
                    : arg.type instanceof RegExp
                    ? `/${arg.type.source}/`
                    : String(arg.type))
                }${arg.default !== undefined ? `=${arg.default}` : ""}${
                  arg.defaultIndex !== undefined
                    ? // @ts-ignore
                      `=${arg.type[arg.defaultIndex]}`
                    : ""
                }${hooks ? "]" : ""}${
                  arg.description ? ` # ${arg.description}` : ""
                }`
              })
              .join("\n")
          }

          embed.addField(
            "arguments:",
            Text.code(
              "# arg: type\n# [optional: type]\n# [optional: type=defaultValue]\n\n",
              "yaml"
            ) +
              " " +
              (Array.isArray(command.args)
                ? command.args
                    .map((group, index) => {
                      return Text.code(groupToString(group), "yaml")
                    })
                    .join(" ")
                : (Text.code(groupToString(command.args)), "yaml")),
            false
          )
        }
        if (command.examples)
          embed.addField("examples:", command.examples.join("\n"), true)
        if (command.owner) embed.addField("owner:", true, true)
        if (command.botOwner) embed.addField("bot owner:", true, true)
        if (command.admin) embed.addField("admin:", true, true)
        if (command.permissions)
          embed.addField(
            "permissions:",
            Text.code(command.permissions.join("\n")),
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
              .map((example) => Text.code(example, "md"))
              .join(""),
            true
          )
      }
    }

    await message.channel.send(embed)
  },
})
