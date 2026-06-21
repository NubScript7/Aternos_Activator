import { serve, type ServerType } from "@hono/node-server";
import { devServer } from "./service/server/index";
import { callbackHandler, type callback } from "./service/util/callback";
import { env } from "./service/util/environment";

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

        process.on('SIGINT', () => this.forceClose())
        process.on('SIGTERM', () => this.forceClose())
        this.#initialized = true
        this.initHandler.resolve(this.server)
    }

    forceClose() {
        this.server?.close(() => {
            console.warn("force closing server...")
            process.exit(0)
        })
    }

    closeServer() {
        if (!env.APP_DEBUG_KILL_ON_ERROR) return console.warn("Server ignored kill signal because debug kill is set to false")
        
        this.server?.close(() => {
            console.log('Server received kill signal, shutting down...')    
            process.exit(0)
        })
    }

    async onInitialize(cb: callback<ServerType>) {
        this.initHandler.onResolve(cb)
    }
}

export const server = new HttpServer()
export type { HttpServer }
