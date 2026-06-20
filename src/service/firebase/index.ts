import { initializeApp, cert, type App } from "firebase-admin/app"
import { getFirebaseCredential } from "./credentials";
import { env } from "../util/environment";
import { callbackHandler } from "../util/callback";

class FirebaseService {
    private static _instance: FirebaseService | null = null
    private _initialized = false

    private initHandler = callbackHandler<App>()

    get initialized() {
        return this._initialized
    }

    app: App | null = null
    
    static getInstance() {
        if(!this._instance) {
            this._instance = new FirebaseService()
            this._instance._initialize()
        }

        return this._instance
    }

    private async _initialize() {
        if (this._initialized) return;

        const credential = await getFirebaseCredential()

        if (!credential) {
            throw new Error("Firebase admin credentials is empty.")
        }

        this.app = initializeApp({
            credential: cert(credential),
            databaseURL: env.FIREBASE_DATABASE_URL
        })

        this._initialized = true
        this.initHandler.resolve(this.app)
    }

    async onInitialize(cb?: () => void) {
        return this.initHandler.onResolve(cb)
    }
}

export const firebaseService = FirebaseService.getInstance()

export type { FirebaseService }
