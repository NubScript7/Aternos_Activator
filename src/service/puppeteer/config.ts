import type { LaunchOptions } from "puppeteer";
import chromium from "@sparticuz/chromium"

export async function getPuppeteerConfig() {
    return {
        args: [...chromium.args, '--no-sandbox', '--disable-setuid-sandbox'],
        headless: false,
        defaultViewport: {
            height: 768,
            width: 1366,
        }
    } as LaunchOptions
}
