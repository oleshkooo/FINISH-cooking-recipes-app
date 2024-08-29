export type Maybe<T> = T | undefined | null
export type PartialSome<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

type NonFunctionPropertyNames<T> = {
    [K in keyof T]: T[K] extends (...args: any[]) => any ? never : K
}[keyof T]
export type OmitMethods<T> = Pick<T, NonFunctionPropertyNames<T>>
