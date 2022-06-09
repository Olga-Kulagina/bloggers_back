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
        userName: string
        email: string
        passwordHash: string
        createdAt: Date
    },
    emailConfirmation: {
        confirmationCode: string,
        expirationDate: Date
        isConfirmed: boolean,
    }
}>

