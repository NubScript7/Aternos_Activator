import { getAternosCookie, updateAternosCookie } from "./cookieManager";
import type { Page, ScreenshotOptions, Browser } from "puppeteer-core";
import { injectHelper } from "./helperInjector";
import { wait } from "../util/timer";
import { puppeteerService } from "../puppeteer/index";
import { server } from "../../server";
import { env } from "../util/environment";

export enum AternosServerStatus {
    STOPPED,
    ACTIVE,
    QUEUED
}

export enum AternosServerActions {
    START,
    STOP,
    RESTART,
    CONFIRM,
    CANCEL
}

export const AternosServerActionsSelector = {
    [AternosServerActions.START]: "#start",
    [AternosServerActions.STOP]: "#stop",
    [AternosServerActions.RESTART]: "#restart",
    [AternosServerActions.CONFIRM]: "#confirm",
    [AternosServerActions.CANCEL]: "#cancel"
} as const

export type AternosServerActionsType = {
    start: boolean,
    stop: boolean,
    restart: boolean,
    confirm: boolean,
    cancel: boolean
}

export const serverActions = Object.keys(AternosServerActions).filter(e => isNaN(parseInt(e))).map(e => e.toLowerCase())

export class AternosService {
    protected static instance: AternosService | null = null

    private _status = {
        hasPageLoaded: false,
        isServiceReady: false,
    }

    get status() {
        return {...this._status}
    }

    hasReportedError = false
    launchError: Error | null = null

    cookies: any[] | null = null
    browser: Browser | null = null
    page: Page | null = null
    serverStatus: string = ""
    serverStatusListeners: Map<number, Function> = new Map()

    
    serverActions: AternosServerActionsType = {
        start: false,
        stop: false,
        restart: false,
        confirm: false,
        cancel: false
    }

    serverActionListeners: Map<number, Function> = new Map()

    static getInstance() {
        if(!this.instance) {
            this.instance = new AternosService()
        }

        return this.instance
    }

    /* private class methods */

    private async loadCookies() {
        if(!this.browser) {
            console.log("Browser not initiailized. Aborting loading cookies.")
            return
        }

        const cookie = await getAternosCookie()
        await this.browser.setCookie(...cookie)
        this.cookies = cookie

        if(cookie == null) {
            console.log("COOKIES = NULL, STOPPING")
            await this.browser.close()
            return
        }
    }

    // doent work anymore
    private async bypassAdblockerDetection(page: Page) {
    await page.evaluateOnNewDocument(() => {
        // @ts-ignore
        delete navigator.__proto__.webdriver;
        // @ts-ignore
        window.adsbygoogle = window.adsbygoogle || [];
        // @ts-ignore
        window.googletag = window.googletag || {};
        // @ts-ignore
        window.googletag.cmd = window.googletag.cmd || [];
        // @ts-ignore
        window.canRunAds = true;
        // @ts-ignore
        window.adBlockEnabled = false;
    });
}

    private async navigatePage() {
        const page = await this.browser?.newPage()!
        // this.bypassAdblockerDetection(page)
        
        await page.goto(env.ATERNOS_URL, {
            timeout: 0,
            waitUntil: "domcontentloaded"
        })

        this.page = page
        this._status.hasPageLoaded = true
        console.log("page has been initialized and ready.")
    }

    private async injectServerActionObserver() {
        if(!this.page) return

        await this.page.exposeFunction("reportServerActionChange", (actions: AternosServerActionsType) => {
            this.serverActions = actions
            this.serverActionListeners.forEach(e => e(actions))
        })

        await this.page.evaluate(() => {
            const element = document.querySelector(".server-actions")!
            
            const observer = new MutationObserver((list) => {
                for (const mut of list) {
                    if (mut.type === "attributes" && mut.attributeName === "class") {

                        const actions = window.getAvailableServerActions()
                        window.reportServerActionChange(actions)
                    }
                }
            })

            observer.observe(element, {
                attributeOldValue: true,
                attributes: true,
            })
        })
    }

    private async injectStatusObserver() {
        if(!this.page) return
        
        await this.page.exposeFunction("reportStatusChange", (status: string) => {
            this.serverStatus = status
            this.serverStatusListeners.forEach(e => e(status))
        })

        await this.page.evaluate(() => {
            const element = document.querySelector(".statuslabel-label")!
            
            let oldValue = ''
            const textServer = new MutationObserver((list) => {
                for (const mut of list) {
                    
                    if (mut.type === "childList" && oldValue != mut.target.textContent) {
                        
                        window.reportStatusChange(mut.target.textContent || "[NULL]")
                        oldValue = mut.target.textContent || ""
                    }
                }
            })

            textServer.observe(element, {
                childList: true
            })
        })
    }

    private async checkIsAuthenticated() {

    }

    private async updateAternosCookies() {
        const cookies = await this.browser?.cookies()!
        return updateAternosCookie(cookies)
    }

    /* public exposed methods */

    __DANGER_THROW_ERROR(message: string, confirm: string) {
        if (confirm !== "iknowwhatimdoing") return console.log("ignoring error command, incorrect confirm message.")

        throw new Error(message)
    }

    subscribeServerActionChange(listener: Function) {
        const id = this.serverActionListeners.size
        this.serverActionListeners.set(id, listener)
        return id
    }

    subscribeServerStatusChange(listener: Function) {
        const id = this.serverStatusListeners.size
        this.serverStatusListeners.set(id, listener)
        return id
    }

    async getAvailableServerActions() {
        if(!this.page) return

        const actions: AternosServerActionsType = await this.page.evaluate(() => window.getAvailableServerActions())
        return actions
    }

    async closeAlertbox() {
        if(!this.page) return false

        return this.page.evaluate(() => window.closeNotificationAlertBox())
    }

    async sendServerAction(action: AternosServerActions) {
        if(!this.page) return
        
        try {
            let selector = AternosServerActionsSelector[action]
            const actionBtn = await this.page.$(selector)
            
            await this.closeAdbox()
            await actionBtn?.click()
            await wait(1000)
            return this.closeAlertbox()

        } catch (err) {
            console.log({
                type: typeof err,
                err
            })
        }
    }

    async getServerStats() {
        if(!this.page) return
        
        const status = await this.page.waitForSelector(".statuslabel-label")
        const statusText = await status?.evaluate(el => el.textContent)
        
        const position = await this.page.waitForSelector(".queue-position")
        const positionText = await position?.evaluate(el => el.textContent)
        
        const time = await this.page.waitForSelector(".queue-time")
        const timeText = await time?.evaluate(el => el.textContent)

        return {
            status: statusText?.trim(),
            queuePosition: positionText?.trim(),
            queueTime: timeText?.trim()
        }
    }

    // i dont think this really works
    /* 
        possible workaround:
        - when clicking an action button, the ad box can disappear but the action does not work.
        - so we can instead detect if the servser status has changed,
          if it has not changed that means the ad box was visible
          and we should try clicking again.
        
        *This is a workaround because the ad box rarely shows up and it is difficult to test
        and implement a solution here that work reliably
    */
    async closeAdbox() {
        if(!this.page) return

        try {
            const hasAdBox = await this.page.evaluate(() => window.isAdboxVisible())
            
            if(hasAdBox) {
                const adBox = await this.page.$("#dismiss-button-element > div")
                await adBox?.click()

                // .continue-prompt-text
            }
        } catch (err) {
            console.log({
                type: typeof err,
                err
            })
        }
    }

    async evaluate(script: string) {
        return this.page?.evaluate(script)
    }

    
    takeScreenshot(options?: ScreenshotOptions) {
        return this.page!.screenshot(options || {
            fullPage: true,
            optimizeForSpeed: true,
            type: "jpeg",
            quality: 50
        })
    }

    async postlaunchSetup() {
        await injectHelper(this.page!)
        const isHelpersInjected = await this.page?.evaluate(() => window.isHelpersInjected())
        console.log(isHelpersInjected)

        await this.injectStatusObserver()
        await this.injectServerActionObserver()

        console.log("closing any open alert box...")
        await this.closeAlertbox()

        console.log("closing any ads...")
        await this.closeAdbox()

        console.log("re-updating cookies...")
        await this.updateAternosCookies()
    }

    async launch() {
        if (this._status.isServiceReady) {
            console.log("Aternos is already initialized!")
            return
        }
        
        try {
            this.browser = await puppeteerService.getBrowser()
            await this.loadCookies()
            await this.navigatePage()

            if (!env.APP_DEBUG_BARE_PUPPETEER_ONLY) {
                await this.postlaunchSetup()
            }
    
            this._status.isServiceReady = true
            console.log("Aternos service is ready!!")
        } catch (err) {
            if (err instanceof Error) {
                console.log("Something went wrong!")
                this.launchError = err
            }
            
            console.log({err})
            server.closeServer()
        }
    }

}
