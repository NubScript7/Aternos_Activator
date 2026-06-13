import { readFile, writeFile } from "fs/promises";
import path from "path";
import { env } from "../util/environment.js";
import { CookieLoaderManagerService } from "../cookieLoader/index.js";
import { FirebaseDatabaseService } from "../firebase/database/index.js";
import { ATERNOS_DB_PATH_PREFIX, type AternosCookieLoaderService } from "../cookieLoader/aternosCookie.js";

const cookiePath = path.resolve(process.cwd(), "./secret/cookie/aternos.json")
const cookieLoaderManager = CookieLoaderManagerService.getInstance()

const database = FirebaseDatabaseService.getInstance()

export async function getAternosCookieFromFile() {
    try {
        const cookie = await readFile(cookiePath, "utf8")
        const json = JSON.parse(cookie)

        return json
    } catch (err) {
        console.warn("Failed to read Aternos cookie:", err)
        return null
    }
}
export async function getAternosCookieFromLoader() {
    await cookieLoaderManager.initialize()
    const cookie = cookieLoaderManager.cookieLoaders.aternos?.cookie!

    return cookie
}

export async function getAternosCookie() {
    if (env.APP_ENVIRONMENT_STATE == "production") {
        return getAternosCookieFromLoader()
    } else {
        return getAternosCookieFromFile()
    }
}

export function updateAternosCookieToLoader(cookies: any[]) {
    const cookiesString = JSON.stringify(cookies)
    const aternosLoader = cookieLoaderManager.cookieLoaders.aternos as AternosCookieLoaderService

    return aternosLoader.setCookie(cookiesString)
}

export async function updateAternosCookieToFile(cookies: any[]) {
    try {
        const cookiesString = JSON.stringify(cookies, null, 2)
        return writeFile(cookiePath, cookiesString)
    } catch (err) {
        console.warn("Failed to write Aternos cookie:", err)
        return null
    }
    
}

export function updateAternosCookie() {
    
}
