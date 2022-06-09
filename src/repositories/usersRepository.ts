import {bloggersCollection, postsCollection, usersCollection} from "./db";
import {BloggerType} from "./bloggersRepository";
import {oldUserDBType, UserDBType} from "./types";

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
