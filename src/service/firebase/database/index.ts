import { getDatabase, type Database } from "firebase-admin/database"
import { FirebaseService } from "../index.js";
export const FIREBASE_DATABASE_PREFIX = "AternosActivator/cookie"

export class FirebaseDatabaseService {
    private static _instance: FirebaseDatabaseService | null = null

    firebase: FirebaseService | null = null
    db: Database | null = null

    static getInstance() {
        if(!this._instance) {
            this._instance = new FirebaseDatabaseService()
        }

        return this._instance
    }

    initialize() {
        this.firebase = FirebaseService.getInstance()
        this.firebase.initialize()

        this.db = getDatabase(this.firebase.app!)
        
    }
}
