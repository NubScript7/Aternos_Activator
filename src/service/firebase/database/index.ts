import { getDatabase, type Database } from "firebase-admin/database"
import { firebaseService, type FirebaseService } from "../index";
import { callbackHandler } from "../../util/callback";
export const FIREBASE_DATABASE_PREFIX = "AternosActivator/cookie"

class FirebaseDatabaseService {
    private static _instance: FirebaseDatabaseService | null = null
    private initHandler = callbackHandler<Database>()

    db: Database | null = null

    static getInstance() {
        if(!this._instance) {
            this._instance = new FirebaseDatabaseService()
            this._instance._initialize()
        }

        return this._instance
    }

    private async _initialize() {

        const app = await firebaseService.onInitialize()
        this.db = getDatabase(app)
        this.initHandler.resolve(this.db)
    }

    async onInitialize(cb?: () => void) {
        return this.initHandler.onResolve(cb)
    }
}

export const firebaseDatabase = FirebaseDatabaseService.getInstance()

export type { FirebaseDatabaseService }
