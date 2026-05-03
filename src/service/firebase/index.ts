import { initializeApp, cert, type App } from "firebase-admin/app"
import { getFirebaseCredential } from "./credentials.js";
import { env } from "../util/environment.js";

export class FirebaseService {
    private static _instance: FirebaseService | null = null
    private _initalized = false

    get initialized() {
        return this._initalized
    }

    app: App | null = null
    
    static getInstance() {
        if(!this._instance) {
            this._instance = new FirebaseService()
        }

        return this._instance
    }

    initialize() {
        if (this._initalized) return;

        this.app = initializeApp({
            credential: cert(getFirebaseCredential()),
            databaseURL: env.FIREBASE_DATABASE_URL
        })

        this._initalized = true
    }
}
