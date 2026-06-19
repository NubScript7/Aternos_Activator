import { config } from "dotenv";
import { env } from "../util/environment.js"
import { fileExists } from "../util/filesystem.js";
import { resolve } from "path";
import { readFile } from "fs/promises";
import type { ServiceAccount } from "firebase-admin";
import { decode, DECRYPT_LIB_PASSWORD } from "../util/encoder.js";

const credPath = resolve(process.cwd(), "./secret/cookie/firebaseAdmin.json")

export async function getFirebaseCredential() {
    return await (env.APP_ENVIRONMENT_STATE === "production" ? getFirebaseCredentialFromEnv() : getFirebaseCredentialFromFile())
}

export async function getFirebaseCredentialFromEnv() {
    const decrypted = await decode(env.FIREBASE_ADMIN_CREDENTIALS, DECRYPT_LIB_PASSWORD)
    const json = JSON.parse(decrypted)

    return json as ServiceAccount
}

export async function getFirebaseCredentialFromFile() {
    if (!await fileExists(credPath)) throw new Error("Firebase filesystem credentials not found.")

    const json = await readFile(credPath, "utf8")
    const data = JSON.parse(json)

    return data as ServiceAccount
}
