import { serve, type ServerType } from "@hono/node-server";
import { devServer } from "./service/server/index.js";
import { callbackHandler, type callback } from "./service/util/callback.js";

class HttpServer {
    #initialized = false
    server: ServerType | null = null
    private initHandler = callbackHandler<ServerType>()

    startServer() {
        if (this.#initialized) return;

        this.server = serve({
            fetch: devServer.fetch,
            port: 3000
        })

        process.on('SIGINT', () => this.closeServer)
        process.on('SIGTERM', () => this.closeServer)
        this.#initialized = true
        this.initHandler.resolve(this.server)
    }

    closeServer() {
        this.server!.close(() => {
            console.log('Server closed')
            process.exit(0)
        })
    }

    async onInitialize(cb: callback<ServerType>) {
        this.initHandler.onResolve(cb)
    }
}

export const server = new HttpServer()
export type { HttpServer }
