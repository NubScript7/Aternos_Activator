import axios from "axios";
import { env } from "./environment.js";

type PSID = string;

export class Sender {
    private static instance: Sender

    private _axios = axios.create({
        baseURL: `https://graph.facebook.com/v25.0/${env.FB_PAGE_ID}`,
        params: {
            access_token: env.FB_PAGE_TOKEN
        }
    })

    static getInstance() {
        if (!Sender.instance) {
            Sender.instance = new Sender()
        }

        return Sender.instance
    }

    async send(message: string, target: PSID) {
        return this._axios({
            method: "post",
            url: "/messages",
            data: {
                message: {
                    text: message || "INTERNAL: response was empty."
                },
                recipient: {
                    id: "34884787431137246"
                }
            }
        })
    }

    async sendAll(messages: string[], target: PSID) {
        try {
            for (const item of messages) {
                await this.send(item, target)
            }
        } catch(e) {
            console.log(typeof e)
        }
    }
}



// export function handleCommand(message: string, id: PSID): [string[], boolean] {
//     const output: string[] = [];
//     const isCommand = message.startsWith(PREFIX);
    
//     const messageArgs: string[] = isCommand ? message.slice(PREFIX.length).split(" ") : [message];
    
//     if (typeof messageArgs !== "object" && !Array.isArray(messageArgs)) return [output, isCommand];

//     const [commandName, ...args] = messageArgs;
//     const command = COMMANDS[commandName] ?? COMMANDS._default;

//     if(!isCommand || command === undefined) {
//         return [output, isCommand];
//     }

//     if (messageArgs.length === 1) {
//         if (typeof command.default === "function") {
//             output.push(...command.default(id, ...args));
//         } else {
//             output.push(...command.default);
//         }
//     } else if (typeof command?.run === "function") {
//         command.run(output, id, ...args);
//     }
    

//     return [output, isCommand];
// }
