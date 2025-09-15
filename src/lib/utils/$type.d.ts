export type Prettier<T extends object> = { [K in keyof T]: T[K] } & {}

