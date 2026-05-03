import { createAdapter } from "iocane";

export async function encode(value: string, password: string) {
    const adapter = createAdapter()

    const result = await adapter.encrypt(value, password) as string
    return result
}

export async function decode(value: string, password: string) {
    const adapter = createAdapter()

    const result = await adapter.decrypt(value, password) as string
    return result
}
