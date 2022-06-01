import {WithId} from 'mongodb'

export type UserDBType = WithId<{
    id: string
    login: string
    passwordHash: string
    createdAt: Date
}>

