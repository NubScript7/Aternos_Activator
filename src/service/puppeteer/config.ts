import chromium from "@sparticuz/chromium"
import type { LaunchOptions } from "puppeteer-core";

export async function getPuppeteerConfig() {
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
