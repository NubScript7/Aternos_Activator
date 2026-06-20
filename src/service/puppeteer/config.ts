import chromium from "@sparticuz/chromium"
import type { LaunchOptions } from "puppeteer-core";
import { env } from "../util/environment";
import { IS_PRODUCTION } from "../util/state";

export async function getProductionConfig() {
    return {
        args: [...chromium.args, '--no-sandbox', '--disable-setuid-sandbox'],
        headless: false,
        executablePath: await chromium.executablePath(),
        defaultViewport: {
            height: 768,
            width: 1366,
        }
    } as LaunchOptions
}

export async function getLocalConfig() {
    return {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        headless: false,
        defaultViewport: {
            height: 768,
            width: 1366,
        }
    } as LaunchOptions
}

export function getPuppeteerConfig() {
    return IS_PRODUCTION ? getProductionConfig() : getLocalConfig()
}
