import Discord from "discord.js"
import Logger from "./Logger"
import client from "../globals/client"

Logger.load("file", __filename)

export type EventName = keyof CustomEvents
export type EventParams<K extends EventName> = CustomEvents[K]

export interface CustomEvents extends Discord.ClientEvents {
  modulesReady: []
  databaseReady: []
  webhookFilter: [Discord.Message, string]
}

export interface EventOptions<K extends EventName> {
  caller: "on" | "once"
  name: K
  call: (...arg: EventParams<K>) => void
  description: string
}

export default class Event<K extends EventName> {
  static events: Discord.Collection<
    EventName,
    Event<EventName>[]
  > = new Discord.Collection()

  get caller() {
    return this.options.caller
  }
  get name() {
    return this.options.name
  }
  get description() {
    return this.options.description
  }

  constructor(private options: EventOptions<K>) {
    // @ts-ignore
    client[options.caller](options.name, options.call)
    if (!Event.events.has(options.name)) {
      Event.events.set(options.name, [this as any])
    } else {
      Event.events.get(options.name)?.push(this as any)
    }
  }
}
