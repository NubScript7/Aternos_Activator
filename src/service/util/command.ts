import { AternosServerActions, AternosService, serverActions, type AternosServerActionsType } from "../aternos/index.js";

export const PREFIX = "!";
type PSID = string;

const aternos = AternosService.getInstance()

export type CommandStructure = {
    [commandName: string]: {
        default: (string[] | Promise<string[]>) | ((id: PSID, ...args: any[]) => (string[] | Promise<string[]>));
        run?: (output: string[], id: PSID, ...args: string[]) => void;
    };
};

export const COMMANDS: CommandStructure = {
    help: {
        default: [
            `To use, type the message you want to ask Aternos Activator or you could use these commands:\n\n` +
            "!help - used to print this help message\n" +
            "!available-actions - gets the available server actions" +
            "!actions - gives the list of valid server actions" +
            "!click [action] - clicks a server action",
            "!info - gets the current server stats"
        ]
    },

    info: {
        default: async () => {
            if (!aternos.status.isServiceReady) {
                return ["Aternos service is still initializing..."]
            }

            const info = await aternos.getServerStats()

            return ["Server stats: \n\n" + `position: ${info?.queuePosition || "?/?"}\n` + `time: ${info?.queueTime || "0s"}\n` + `status: ${info?.status}`]
        }
    },

    click: {
        run: (output, _id, action) => {
            if (!aternos.status.isServiceReady) {
                return output.push("Aternos service is still initializing...")
            }

            if (!serverActions.includes(action)) {
                return output.push("Not a valid action.")
            }

            aternos.sendServerAction(AternosServerActions[action.toUpperCase() as keyof typeof AternosServerActions])

            output.push(`Sent the '${action}' action to the server`)
        },

        default: ["This is used to click a server action. Type '!actions' to see the current available actions."]
    },

    actions: {
        default: ["List of available server actions: \n\n" + serverActions.join("\n")]
    },

    "available-actions": {
        default: async () => {
            if (!aternos.status.isServiceReady) {
                return ["Aternos service is still initializing..."]
            }

            const actionsRaw = await aternos.getAvailableServerActions() as AternosServerActionsType
            
            const actions = Object.keys(actionsRaw).filter(key => !!actionsRaw[key as keyof typeof actionsRaw])

            return ["Available Actions: \n\n" + actions.join("\n")]
        }
    },
    
    _default: {
        default: ["That is an invalid command."]
    }
};


export async function handleCommand(message: string, id: PSID): Promise<[string[], boolean]> {
    const output: string[] = [];
    const isCommand = message.startsWith(PREFIX);

    const messageArgs: string[] = isCommand ? message.slice(PREFIX.length).split(" ") : [message];

    if (typeof messageArgs !== "object" && !Array.isArray(messageArgs)) return [output, isCommand];

    const [commandName, ...args] = messageArgs;
    const command = COMMANDS[commandName] ?? COMMANDS._default;

    if (!isCommand || command === undefined) {
        return [output, isCommand];
    }

    if (messageArgs.length === 1) {
        if (typeof command.default === "function") {
            
            const maybePromise = command.default(id, ...args);
            const resolved = await Promise.resolve(maybePromise);

            output.push(...resolved);
        } else {
            const resolve = await Promise.resolve(command.default)
            output.push(...resolve);
        }
    } else if (typeof command?.run === "function") {
        command.run(output, id, ...args);
    }

    return [output, isCommand];
}
