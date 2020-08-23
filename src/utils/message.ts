import Discord from "discord.js"
import Globals from "../app/Globals"

export async function messageAwaiter(
  filter: (message: Discord.Message) => Promise<boolean> | boolean,
  options: {
    maxTime?: number
    maxTries?: number
    maxIdleTime: number
    stopper?: (message: Discord.Message) => Promise<boolean> | boolean
  } = { maxIdleTime: 10000 }
): Promise<Discord.Message | null> {
  let message: Discord.Message | null
  let tries = 0,
    time = Date.now(),
    idleTime: number,
    stop = false

  do {
    idleTime = Date.now()

    message = await new Promise<Discord.Message | null>((resolve) => {
      Globals.client.once("message", async (message) => {
        resolve((await filter(message)) ? message : null)
      })
    })

    stop = idleTime + options.maxIdleTime < Date.now()
    if (!stop && options.stopper && message)
      stop = await options.stopper(message)
    if (!stop && options.maxTime) stop = time + options.maxTime < Date.now()
    if (!stop && options.maxTries) stop = tries > options.maxTries
  } while (!message && !stop)
  return message
}

export default {
  messageAwaiter,
}
