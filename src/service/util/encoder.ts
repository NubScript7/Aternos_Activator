import { createAdapter } from "iocane";
import { env } from "./environment.js";

export const { DECRYPT_LIB_PASSWORD } = env;

export async function encode(value: string, password: string) {
    const adapter = createAdapter()
    const result = await adapter.encrypt(value, password) as string
    const wrapped = Buffer.from(result).toString("base64")
    
    return wrapped
}

export async function decode(value: string, password: string) {
    const adapter = createAdapter()
    const unwrapped = Buffer.from(value, "base64").toString('utf8')
    const result = await adapter.decrypt(unwrapped, password) as string

    return result
}
