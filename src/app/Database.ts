import Enmap from "enmap"
import Logger from "./Logger"

Logger.load("file", __filename)

/** The Enmap database of bot system */
const db = new Enmap({ name: "db" })

export default db
module.exports = db
