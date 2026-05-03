import { readFile } from "fs/promises";
import path from "path";
import { env } from "../util/environment.js";
import { CookieLoaderManagerService } from "../cookieLoader/index.js";

const cookiePath = path.resolve(process.cwd(), "./secret/cookie/aternos.json")
const cookieLoaderManager = CookieLoaderManagerService.getInstance()

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
