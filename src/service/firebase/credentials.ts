import { config } from "dotenv";
import { env } from "../util/environment.js"

config({quiet: true})

export function getFirebaseCredential() {
    const list = env.FIREBASE_CRED_LIST.split(",")
    const object = Object.fromEntries(list.map(k => [k.toLowerCase(), process.env[k as keyof typeof process.env]]))

    return object
}
