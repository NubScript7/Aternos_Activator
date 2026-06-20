import { readFile, writeFile } from "fs/promises";
import path from "path";
import { env } from "../util/environment";
import { CookieLoaderManagerService } from "../cookieLoader/index";
import { type AternosCookieLoaderService } from "../cookieLoader/aternosCookie";

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

export async function updateAternosCookieToLoader(cookies: any[]) {
    const aternosLoader = cookieLoaderManager.cookieLoaders.aternos as AternosCookieLoaderService

    return aternosLoader.setCookie(cookies)
}

export async function updateAternosCookieToFile(cookies: any[]) {
    try {
        const cookiesString = JSON.stringify(cookies, null, 2)
        return writeFile(cookiePath, cookiesString)
    } catch (err) {
        console.warn("Failed to write Aternos cookie:", err)
    }
}

export function updateAternosCookie(cookies: any[]) {
    if (env.APP_ENVIRONMENT_STATE == "production") {
        return updateAternosCookieToLoader(cookies)
    } else {
        return updateAternosCookieToFile(cookies)
    }
}
