import { Hono } from "hono";
import type { MessengerWebhookPayload } from "./payload.js";
import { AternosService } from "../aternos/index.js";
import { onNewMessageWebhook, onNewVerifyWebhook } from "./webhooks.js";

export const messenger = new Hono({strict: false})
const aternos = AternosService.getInstance()

messenger.use("*", async (c, next) => {
    if(!aternos.status.isServiceReady) {
        return c.text("Aternos service is still initalizing, please try again later.")
    }

    return next()
})

messenger.post("/webhook", async (c) => {
    const body: MessengerWebhookPayload = await c.req.json()

    if (body.object !== "page") {
        return c.status(403)
    }

    onNewMessageWebhook(body)

    c.status(200)
    return c.body(null)
})

messenger.get("/webhook", onNewVerifyWebhook)

messenger.get("/", (c) => c.text("this service is open"))

console.log("The messenger service is hooked.")
