import { CookieLoaderService } from "./CookieLoaderService.js";
import { decode, DECRYPT_LIB_PASSWORD, encode } from "../util/encoder.js";
import { firebaseDatabase } from "../firebase/database/index.js";

export const ATERNOS_DB_PATH_PREFIX = "service/aternos/cookieString"
// const valueKey = "cookieString"

export class AternosCookieLoaderService extends CookieLoaderService {
    
    hasLoaded = false
    cookie: any[] = []
    
    async loadCookie() {
        if (this.hasLoaded) return
        const db = await firebaseDatabase.onInitialize()

        const cookiePath = db.ref(ATERNOS_DB_PATH_PREFIX)
        const cookie = await cookiePath?.once("value")
        
        if (!cookie.exists()) return

        const valueRaw = cookie.val()
        const value = await decode(valueRaw, DECRYPT_LIB_PASSWORD)
        const json = JSON.parse(value)

        this.cookie = json
    }

    /**
     * Provide cookies in stringified form
     */
    async setCookie(cookies: any[]) {
        const json = JSON.stringify(cookies)
        const value = await encode(json, DECRYPT_LIB_PASSWORD)

        const db = await firebaseDatabase.onInitialize()
        const cookiePath = db.ref(ATERNOS_DB_PATH_PREFIX)
        return cookiePath.set(value)
    }
    
}
