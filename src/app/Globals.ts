import bot from "../globals/bot"
import client from "../globals/client"
import db from "../globals/db"
import Logger from "./Logger"

Logger.load("file", __filename)

/** Your own global object (you can put your own database inside!) */
export const custom: {} = {}

const Globals = {
  custom,
  bot,
  db,
  client,
}

export default Globals
module.exports = Globals
