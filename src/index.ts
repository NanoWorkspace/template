import dotenv from "dotenv"
import path from "path"
import Globals from "./app/Globals"

dotenv.config({ path: path.join(__dirname, "..", ".env") })

Globals.client.login(process.env.TOKEN).catch(console.error)
