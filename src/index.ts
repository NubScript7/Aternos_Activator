import { serve } from "@hono/node-server";
import { AternosServerActions, AternosService, type AternosServerActionsType } from "./service/aternos/index.js";
import { server } from "./service/server/index.js";

async function main() {
    serve({
        fetch: server.fetch,
        port: 3000
    })
    console.log("Server is running...")

    const aternos = AternosService.getInstance()
    await aternos.launch()

    aternos.subscribeServerStatusChange((status: string) => {
        console.log("The status has changed to:", status)
    })

    aternos.subscribeServerActionChange((actions: AternosServerActionsType) => {
        console.log("The server action buttons has changed.")
        
        if (actions.confirm) {
            aternos.sendServerAction(AternosServerActions.CONFIRM)
        }
    })

}

main()
