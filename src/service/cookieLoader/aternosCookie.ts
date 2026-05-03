import { config } from "dotenv";
import { FirebaseDatabaseService } from "../firebase/database/index.js";
import { CookieLoaderService } from "./CookieLoaderService.js";
import { createAdapter } from "iocane"
import { decode } from "../util/encoder.js";

config({quiet: true})

const ATERNOS_DB_PATH_PREFIX = "service/aternos/cookie"

export class AternosCookieLoaderService extends CookieLoaderService {
    
    hasLoaded = false
    cookie: any[] = []
    
    async loadCookie() {
        if (this.hasLoaded) return

        const database = FirebaseDatabaseService.getInstance()
        database.initialize()

        const cookiePath = database.database?.ref(ATERNOS_DB_PATH_PREFIX)
        const cookie = await cookiePath?.once("value")
        const valueRaw = cookie?.child("string").val()

        if (!valueRaw) return

        const password = process.env.ATERNOS_COOKIE_LOADER_DECRYPT_PASWRD
        const value = await decode(valueRaw, password!)
        const json = JSON.parse(value)

        this.cookie = json
    }
    
}
