import { server } from "./server";
import { AternosServerActions, AternosService, type AternosServerActionsType } from "./service/aternos/index";

async function main() {
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

server.onInitialize(() => {
    console.log("Server is running...")
    main()
})

server.startServer()
