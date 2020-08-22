import Enmap from "enmap"
import Logger from "./Logger"

Logger.load("file", __filename)

/** The Enmap database of bot system */
export const db = new Enmap({ name: "db" })
