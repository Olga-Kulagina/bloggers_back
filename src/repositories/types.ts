import {WithId} from 'mongodb'

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





