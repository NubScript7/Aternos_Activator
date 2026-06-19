export type callback<T = void> = (val: T) => void;

export function callbackHandler<resolveType = void>() {
    let isDone = false
    let cache: resolveType
    let externalResolve!: (value: resolveType) => void;

    const promise = new Promise<resolveType>(resolve => externalResolve = resolve)
    const listeners: callback<resolveType>[] = []

    promise.then((val) => {
        isDone = true
        cache = val
        listeners.forEach(e => e(val))
    })

    const onResolve = (cb?: callback<resolveType>) => {
        
        if (typeof cb === "function") {
            if (!isDone) {
                listeners.push(cb)
            } else {
                cb(cache)
            }
            
        }

        return promise
    }

    return {
        resolve: externalResolve,
        promise,
        listeners,
        onResolve
    }
}
