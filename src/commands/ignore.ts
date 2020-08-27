import Command from "../app/Command"
import bot from "../globals/bot"

new Command({
  name: "Ignore Manager",
  pattern: /ign?(?:ore)?/i,
  description: `Gère les utilisateurs et les salons ignorés par ${bot.name}.`,
  admin: true,
  args: {
    action: {
      defaultIndex: 0,
      type: ["add", /rm|remove/i, /ls|list/i],
    },
    items: {
      optional: true,
      type: Command.types.arrayFrom(Command.types.user, Command.types.channel),
    },
  },
  call: ({ message, args: { action, items } }) => {
    // todo: code ignore-command body
  },
})
