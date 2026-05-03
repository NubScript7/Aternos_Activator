import type { MessengerWebhookPayload } from "./payload.js";
import { handleCommand } from "../util/command.js";
import { Sender } from "../util/sender.js";
import type { Context } from "hono";
import { env } from "../util/environment.js";

const sender = Sender.getInstance()

export async function onNewMessageWebhook(body: MessengerWebhookPayload) {
    for (const entry of body.entry) {
        for (const { message, recipient } of entry.messaging) {
            
            const [output, isCommand] = await handleCommand(message.text, recipient.id)
            
            if (isCommand) {
                return sender.sendAll(output, recipient.id)
            }

            sender.send(`Echo(${recipient.id}): ${message.text}`, recipient.id)
        }
    }
}

export function onNewVerifyWebhook(c: Context) {
    const mode = c.req.query("hub.mode")
    const token = c.req.query("hub.verify_token")
    const challenge = c.req.query("hub.challenge")

    if (!challenge || !mode || !token || mode !== "subscribe" || token !== env.FB_WEBHOOK_VERIFY_TOKEN) {
        c.status(403)
        return c.body(null)
    }
    
    console.log(`WEBHOOK_VERIFIED: ${challenge}`);
    c.status(200)

    return c.text(challenge)
}
