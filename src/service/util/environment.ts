import { config } from 'dotenv';
import { EnvType, load } from 'ts-dotenv';

config({ quiet: true })

export type Env = EnvType<typeof schema>;

export const schema = {
    // facebook
    FB_PAGE_TOKEN: String,
    FB_APP_ID: String,
    FB_PAGE_ID: String,
    FB_WEBHOOK_VERIFY_TOKEN: String,

    // firebase
    FIREBASE_DATABASE_URL: String,
    FIREBASE_ADMIN_CREDENTIALS: String,

    // "production" | "development"
    APP_ENVIRONMENT_STATE: String,
    ATERNOS_URL: String,
    APP_DEBUG_KILL_ON_ERROR: Boolean,
    APP_DEBUG_BARE_PUPPETEER_ONLY: Boolean,

    // "vercel" | "server"
    SERVER_HOST: String,
    DECRYPT_LIB_PASSWORD: String
};

export let env: Env = load(schema)

