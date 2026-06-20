export abstract class CookieLoaderService {

    abstract hasLoaded: boolean
    abstract loadCookie(): void

    abstract cookie: any[]
}

export type CookieLoaderServiceConstructor = new (...args: any[]) => CookieLoaderService;
