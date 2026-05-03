import { Hono } from "hono";
import { AternosServerActions, AternosServerActionsSelector, AternosService, serverActions, type AternosServerActionsType } from "../aternos/index.js";

export const dev = new Hono({ strict: false })
const aternos = AternosService.getInstance()

dev.use("*", async (c, next) => {
    if(!aternos.status.isServiceReady) {
        return c.text("Aternos service is still initalizing, please try again later.")
    }

    return next()
})

const showRouteHelp = true
const routes = [
    "/close/:box - close an alert box (ad, alert)",
    "/click/:action - send a server action (start, stop, restart, confirm, cancel)",
    "/info - get the current server stats",
    "/actions - fetches the available server actions",
    "/status - get the current server status -- DEPRECATED, USE /INFO INSTEAD",
    "/screenshot - takes a screenshot and display it",
    "/evaluate - used to send executable javascript to the browser",
    "/ping - test the server",
]


dev.get("/", (c) => {
    if(showRouteHelp) {
        return c.text("Route API: \n" + routes.join("\n"))
    }

    return c.text("This is the aternos API")
})

dev.get("/close/:box", async (c) => {
    const box = c.req.param("box")

    let success = true
    try {
        switch (box) {
            case "ad":
                await aternos.closeAdbox()
                break
            case "alert":
                await aternos.closeAlertbox()
                break
            default:
                success = false
                break
        }
    } catch (err) {
        console.error({err, box})
    }

    return c.json({ success: false })
})

dev.get("/click/:action", async (c) => {
    let success = true
    const action = c.req.param("action")

    const isValidAction = serverActions.includes(action)
    const serverStatus = aternos.serverStatus

    if(isValidAction) {
        try {
            await aternos.sendServerAction(AternosServerActions[action.toUpperCase() as keyof typeof AternosServerActions])
        } catch (err) {
            console.error(err)
            success = false
        }
    }

    return c.json({ success })
})

dev.get("/info", async (c) => {
    const info = await aternos.getServerStats()
    
    return c.json(info)
})

dev.get("/actions", async (c) => {
    const actions = await aternos.getAvailableServerActions()

    return c.json(actions)
})

dev.get("/status", (c) => {
    return c.text("This API endpoint is deprecated, please use /info instead.")
})

dev.get("/screenshot", async (c) => {
    const image = await aternos.takeScreenshot()

    return c.body(image!, 200, {
        "Content-Type": "image/jpeg"
    })
})

dev.post("/evaluate", async (c) => {
    const body = await c.req.json()

    if (body.evalScript && typeof body.evalScript == "string") {
        console.log("Received custom eval script, running...")

        try {
            const output = await aternos.evaluate(body.evalScript)
            return c.json({ output, error: null, success: true })
        } catch (error) {
            return c.json({ error, output: null, success: false })
        }
    }

    return c.json({ output: null, error: null, success: false })
})

dev.get("/ping", (c) => c.text("pinged!!"))
