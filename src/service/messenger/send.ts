import axios from "axios"
import { config } from "dotenv";
import { env } from "../util/environment";

config()

// henri stekekin

export class MessengerSender {
    private static _instance: MessengerSender
    
    private _axios = axios.create({
        baseURL: `https://graph.facebook.com/v25.0/${env.FB_PAGE_ID}`,
        params: {
            access_token: env.FB_PAGE_TOKEN
        }
    })

    static getInstance() {
        if(!this._instance) {
            this._instance = new MessengerSender()
        }

        return this._instance
    }

    sendMessage(message: string) {
        this._axios({
            method: "post",
            url: "/messages",
            data: {
                message: {
                    text: message
                },
                recipient: {
                    id: "34884787431137246"
                }
            }
        })

    }
}
