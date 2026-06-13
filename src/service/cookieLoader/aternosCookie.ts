import { config } from "dotenv";
import { FirebaseDatabaseService } from "../firebase/database/index.js";
import { CookieLoaderService } from "./CookieLoaderService.js";
import { createAdapter } from "iocane"
import { decode } from "../util/encoder.js";

config({quiet: true})

export const ATERNOS_DB_PATH_PREFIX = "service/aternos/cookie"

const database = FirebaseDatabaseService.getInstance()
database.initialize()
export class AternosCookieLoaderService extends CookieLoaderService {
    
    hasLoaded = false
    cookie: any[] = []
    
    async loadCookie() {
        if (this.hasLoaded) return

        const cookiePath = database.db?.ref(ATERNOS_DB_PATH_PREFIX)
        const cookie = await cookiePath?.once("value")
        const valueRaw = cookie?.child("string").val()

        if (!valueRaw) return

        const password = process.env.ATERNOS_COOKIE_LOADER_DECRYPT_PASWRD
        const value = await decode(valueRaw, password!)
        const json = JSON.parse(value)

        this.cookie = json
    }

    /**
     * Provide cookies in stringified form
     */
    setCookie(cookies: string) {
        const cookiePath = database.db?.ref(ATERNOS_DB_PATH_PREFIX)
        return cookiePath?.set(cookies)
    }
    
}
