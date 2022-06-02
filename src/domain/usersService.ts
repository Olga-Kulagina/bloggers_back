import {GetUserType, usersRepository, UserType} from "../repositories/usersRepository";
import {UserDBType} from "../repositories/types";
import {authService} from "./authService";
import {ObjectId} from "mongodb";


export const usersService = {
    async findUsers(PageNumber?: string | null | undefined, PageSize?: string | null | undefined): Promise<GetUserType> {
        return usersRepository.findUsers(PageNumber, PageSize)
    },
    async findUserById(id: string): Promise<UserType | null> {
        return usersRepository.findUserById(id)
    },
    async findUserByLogin(login: string): Promise<UserDBType | null> {
        return usersRepository.findByLogin(login)
    },
    async createUser(login: string, password: string): Promise<UserType | null> {
        const passwordHash = await authService.generateHash(password)
        const newUser: UserDBType = {
            _id: new ObjectId(),
            id: `${+(new Date())}`,
            login,
            passwordHash,
            createdAt: new Date()
        }
        const createdUser = await usersRepository.createUser(newUser)
        let user = {id: createdUser.id, login: createdUser.login}
        return user
    },
    async deleteUser(id: string): Promise<boolean> {
        const result = await usersRepository.deleteUser(id)
        return result
    },
    async deleteAllUsers(): Promise<boolean> {
        const result = await usersRepository.deleteUser()
        return result
    }
}