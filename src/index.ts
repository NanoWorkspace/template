import dotenv from "dotenv"
import path from "path"
import { client } from "./app/Globals"

dotenv.config({ path: path.join(__dirname, "..", ".env") })

client.login(process.env.TOKEN).catch(console.error)
