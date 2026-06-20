import { AternosCookieLoaderService } from "./aternosCookie";
import { CookieLoaderService, type CookieLoaderServiceConstructor } from "./CookieLoaderService";

const loadableCookieServices = {
    aternos: AternosCookieLoaderService
}


/* 
    all cookie loader services should have "CookieLoaderService" appended to the name of another service its loading for
    all cookie loader services should extend "CookieLoaderService"
    and be added to "loadableCookieServices" to be called
*/


export type CookieLoadersMap = {[k in keyof typeof loadableCookieServices]: CookieLoaderService}

export class CookieLoaderManagerService {
    private static _instance: CookieLoaderManagerService | null = null
    
    initialized = false
    cookieLoaders: Partial<CookieLoadersMap> = {}

    static getInstance() {
        if (!this._instance) {
            this._instance = new CookieLoaderManagerService()
        }

        return this._instance
    }

    async initialize() {
        if (this.initialized) return

        for (const [ loaderName, ServiceClass ] of Object.entries(loadableCookieServices)) {

            const loader = new (ServiceClass as CookieLoaderServiceConstructor)()
            
            await Promise.resolve(loader.loadCookie())
            this.cookieLoaders[loaderName as keyof CookieLoadersMap] = loader
        }
        
        this.initialized = true
    }
}
