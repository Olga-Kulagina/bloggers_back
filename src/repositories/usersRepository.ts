import {bloggersCollection, usersCollection} from "./db";
import {BloggerType} from "./bloggersRepository";
import {UserDBType} from "./types";

export type UserType = {
    id: string
    login: string
}
export type PostUserType = {
    id: string
    login: string
    password: string
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
        let a = 1
        if (PageNumber) {
            let b = +PageNumber !== null ? +PageNumber : 1
        }
        let b = 10
        if (PageSize) {
            let b = +PageSize !== null ? +PageSize : 10
        }
        let users = await usersCollection.find({}, {projection: {_id: 0}}).toArray()
        let items = await usersCollection.find({}, {projection: {_id: 0, passwordHash: 0, createdAt: 0}}).skip((+a - 1) * +b).limit(+b).toArray()

        return {
            "pagesCount": Math.ceil(users.length/+b),
            "page": +a,
            "pageSize": +b,
            "totalCount": users.length,
            "items": items
        }
    },
    async findUserById(id: string): Promise<UserType | null> {
        let user = await usersCollection.findOne({id: id}, {projection: {_id: 0}})
        return user
    },
    /*async findUserByLogin(login: string): Promise<UserDBType | null> {
        let user = await usersCollection.findOne({login: login}, {projection: {_id: 0}})
        return user
    },*/
    async createUser(newUser: UserDBType): Promise<UserDBType> {
        const result = await usersCollection.insertOne(newUser)
        return newUser
    },
    /*async create(user: AdminDBType): Promise<AdminDBType> {
        const result = await adminsCollection.insertOne(user)
        return user
    },*/
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
