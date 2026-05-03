import type { LaunchOptions } from "puppeteer";

export const puppeteerOptions: LaunchOptions = {
    headless: false,
    defaultViewport: {
        height: 768,
        width: 1366,
    },
    // args: ['--remote-debugging-port=9222']
}

