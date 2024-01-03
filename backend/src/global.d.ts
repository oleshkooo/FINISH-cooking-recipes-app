declare type Prettier<T> = {
    [K in keyof T]: T[K]
} & unknown
