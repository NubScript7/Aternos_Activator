export type MessengerWebhookPayload = {
    object: string,
    entry: MessengerWebhookPayloadEntry[]
}

export type MessengerWebhookPayloadEntry = {
    id: string,
    time: number,
    messaging: MessengerWebhookPayloadEntryMessage[]
}

export type MessengerWebhookPayloadEntryMessage = {
    sender: {
        id: string
    },
    recipient: {
        id: string
    },
    timestamp: string,
    message: {
        mid: string,
        text: string
    }
}

export type PSID = string
