import {WithId} from 'mongodb'

export type oldUserDBType = WithId<{
    id: string
    login: string
    passwordHash: string
    createdAt: Date
}>

export type UserDBType = WithId<{
    id: string
    accountData: {
        login: string
        email: string
        passwordHash: string
        createdAt: Date
        ip: string
    },
    emailConfirmation: {
        confirmationCode: string,
        expirationDate: Date
        isConfirmed: boolean,
    }
}>

