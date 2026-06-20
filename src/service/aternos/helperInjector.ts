import type { Page } from "puppeteer-core";
import type { AternosServerActionsType } from "./index";

export async function injectHelper(page: Page) {
    const helperInjector = () => {
        if (typeof window.isAdboxVisible == "function" || typeof window.getAvailableServerActions == "function") return

        const COUNTDOWN_SECONDS_MARGIN = 3

        const startEl: HTMLButtonElement = document.querySelector("#start")!
        const stopEl: HTMLButtonElement = document.querySelector("#stop")!
        const restartEl: HTMLButtonElement = document.querySelector("#restart")!
        const cancelEl: HTMLButtonElement = document.querySelector("#cancel")!
        const confirmEl: HTMLButtonElement = document.querySelector("#confirm")!
        
        function getAvailableServerActions() {
            const actions = {
                start: startEl.offsetParent != null,
                stop: stopEl.offsetParent != null,
                restart: restartEl.offsetParent != null,
                cancel: cancelEl.offsetParent != null,
                confirm: confirmEl.offsetParent != null,
            } as AternosServerActionsType

            return actions
        }

        function isAdboxVisible() {
            const adBox: HTMLDivElement = document.querySelector("#ad_position_box")!
            const dismissBtn: HTMLButtonElement = document.querySelector("#dismiss-button")!
            const closeBtn: HTMLButtonElement = document.querySelector("#dismiss-button-element > div")!

            if (
                (adBox && adBox.offsetParent != null) ||
                (dismissBtn && dismissBtn.offsetParent != null) ||
                (closeBtn && closeBtn.offsetParent != null)
            ) {
                return true
            }

            return false
        }

        function isForcedAdRewardBoxVisible() {
            const forcedAdEl: HTMLDivElement = document.querySelector("#mys-content")!

            return forcedAdEl && forcedAdEl.offsetParent != null
        }

        async function closeForcedAdRewardBox() {
            return new Promise<boolean>((resolve) => {
                const countdownEl: HTMLDivElement = document.querySelector("#count_down")!
                const closebtnEl: HTMLDivElement = document.querySelector("#close_button_icon")!

                if (countdownEl) {
                    const countdown = parseInt(countdownEl.textContent?.split(" ")[2]!)

                    if (!isNaN(countdown)) {
                        setTimeout(() => {

                            closebtnEl.click()
                            resolve(true)

                        }, countdown + COUNTDOWN_SECONDS_MARGIN)

                        return
                    }
                }

                closebtnEl.click()
                resolve(true)

            })
        }

        function closeNotificationAlertBox() {
            const alertEl: HTMLButtonElement = document.querySelector("#theme-switch > dialog > main > div.alert-buttons.btn-group > button.btn.btn-danger")!
            
            if (alertEl) {
                alertEl.click()
                return true
            }

            return false
        }

        function isHelpersInjected() {
            return "The puppeteer helpers has been injected successfully!"
        }


        window.isForcedAdRewardBoxVisible = isForcedAdRewardBoxVisible
        window.closeForcedAdRewardBox = closeForcedAdRewardBox
        window.closeNotificationAlertBox = closeNotificationAlertBox
        window.isHelpersInjected = isHelpersInjected
        window.isAdboxVisible = isAdboxVisible
        window.getAvailableServerActions = getAvailableServerActions
    }

    page.evaluate(helperInjector)
    page.evaluateOnNewDocument(helperInjector)
}
