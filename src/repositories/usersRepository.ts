import {bloggersCollection, commentsCollection, postsCollection, requestCountCollection, usersCollection} from "./db";
import {BloggerType} from "./bloggersRepository";
import {oldUserDBType, UserDBType} from "./types";
import {addSeconds, formatISO, isBefore} from "date-fns";

export type UserType = {
    id: string
    login: string
}

export type GetUserType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: Array<UserType>
}

export const usersRepository = {
    async findUsers(PageNumber?: string | null | undefined , PageSize?: string | null | undefined): Promise<GetUserType> {
        let a = PageNumber || 1
        let b = PageSize || 10
        let totalCount = await usersCollection.count({})
        let items = await usersCollection.find({}, {projection: {_id: 0, passwordHash: 0, createdAt: 0}}).skip((+a - 1) * +b).limit(+b).toArray()
        let users: Array<UserType> = []
        if (items.length > 0) {
            users = items.map(u => ({id: u.id, login: u.accountData.userName}))
        }

        return {
            "pagesCount": Math.ceil(totalCount/+b),
            "page": +a,
            "pageSize": +b,
            "totalCount": totalCount,
            "items": users
        }
    },
    async findUserById(id: string): Promise<UserType | null> {
        let userDB = await usersCollection.findOne({id: id}, {projection: {_id: 0}})
        if (userDB) {
            let user = {id: userDB.id, login: userDB.accountData.userName}
            return user
        }
        return null
    },
    async findByLoginOrEmail(login: string, email: string): Promise<UserDBType | null> {
        let user = await usersCollection.findOne( {$or : [{"accountData.userName": login}, {"accountData.email": email}]}, {projection: {_id: 0}})
        return user
    },
    async findUserByConfirmationCode(code: string): Promise<UserDBType | null> {
        let user = await usersCollection.findOne( {"emailConfirmation.confirmationCode": code}, {projection: {_id: 0}})
        return user
    },
    async setNewConfirmationCode(id: string, code: string): Promise<boolean> {
        let result = await usersCollection.updateOne( {id: id}, {$set: {"emailConfirmation.confirmationCode": code}})
        return result.matchedCount === 1
    },
    async confirmUser(id: string): Promise<boolean> {
        const result = await usersCollection.updateOne({id: id}, {$set: {"emailConfirmation.isConfirmed": true}})
        return result.matchedCount === 1
    },
    async isMore5UsersOnIp(ip: string, requestTime: number): Promise<boolean> {
        let time10sec = addSeconds(new Date(requestTime), -10).getTime()
        let requestCountItems = await requestCountCollection.find({$and : [{time: {$gt: time10sec}}, {ip: ip}]}, {projection: {_id: 0}}).toArray()
        if (requestCountItems.length > 6) {
            return true
        }
        return false
    },
    async createUser(newUser: UserDBType): Promise<UserDBType> {
        const result = await usersCollection.insertOne(newUser)
        return newUser
    },
    async deleteUser(id?: string): Promise<boolean> {
        let result
        if (id) {
            result = await usersCollection.deleteOne({id: id})
        } else {
            result = await usersCollection.deleteMany({})
        }
        return result.deletedCount === 1
    }
}
