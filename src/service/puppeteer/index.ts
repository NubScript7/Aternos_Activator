import extra, { type PuppeteerExtra } from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import AdblockerPlugin from "puppeteer-extra-plugin-adblocker"
import { getPuppeteerConfig } from "./config";
import type { Browser } from "puppeteer-core";
// import type { Browser } from "./puppeteer.js";


export class PuppeteerService {
    private static _instance: PuppeteerService | null = null

    puppeteer?: PuppeteerExtra
    browser?: Browser

    static geInstance() {
        if (!this._instance) {
            this._instance = new PuppeteerService()
        }

        return this._instance
    }

    private _initService() {
        if (!this.puppeteer) {
            this.puppeteer = extra as unknown as PuppeteerExtra

            const adblocker = AdblockerPlugin({
                blockTrackers: true
            })

            this.puppeteer.use(StealthPlugin())
            // this.puppeteer.use(adblocker)
        }
    }

    getPuppeteer() {
        this._initService()

        return this.puppeteer!
    }

    async getBrowser() {
        this._initService()

        if (!this.browser) {
            const config = await getPuppeteerConfig()
            this.browser = await this.puppeteer!.launch(config)
        }
        
        return this.browser
    }
}

export const puppeteerService = PuppeteerService.geInstance()
