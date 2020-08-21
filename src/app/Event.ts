import fs from "fs"
import path from "path"
import { client } from "./Client"

export const events: string[][] = []

fs.readdirSync(path.join(__dirname, "..", "events")).forEach((fileName) => {
  const eventInfo = fileName.slice(0, fileName.lastIndexOf(".")).split("_")
  const [fn, eventName] = eventInfo
  client[fn as "on" | "once"](
    eventName,
    require(path.join(__dirname, "..", "events", fileName))
  )
  events.push(eventInfo)
})
