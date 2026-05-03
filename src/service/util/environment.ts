import { EnvType, load } from 'ts-dotenv';

export type Env = EnvType<typeof schema>;

export const schema = {
    FB_PAGE_TOKEN: String,
    FB_APP_ID: String,
    FB_PAGE_ID: String,
    FB_WEBHOOK_VERIFY_TOKEN: String,

    // firebase credentials
    FIREBASE_CRED_LIST: String,
    FIREBASE_DATABASE_URL: String,

    // "production" | "development"
    APP_ENVIRONMENT_STATE: String,
};

export let env: Env = load(schema)
