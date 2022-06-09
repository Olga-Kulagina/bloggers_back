import {GetUserType, usersRepository, UserType} from "../repositories/usersRepository";
import {oldUserDBType, UserDBType} from "../repositories/types";
import {authService} from "./authService";
import {ObjectId} from "mongodb";
import {v4} from "uuid"
import {add} from "date-fns";


export const usersService = {
    async findUsers(PageNumber?: string | null | undefined, PageSize?: string | null | undefined): Promise<GetUserType> {
        return usersRepository.findUsers(PageNumber, PageSize)
    },
    async findUserById(id: string): Promise<UserType | null> {
        return usersRepository.findUserById(id)
    },
    async findByLoginOrEmail(login: string, email: string): Promise<UserDBType | null> {
        return usersRepository.findByLoginOrEmail(login, email)
    },
    async createUser(login: string, email: string, password: string): Promise<UserType | null> {
        const passwordHash = await authService.generateHash(password)
        const newUser: UserDBType = {
            _id: new ObjectId(),
            id: `${+(new Date())}`,
            accountData: {
                userName: login,
                email,
                passwordHash,
                createdAt: new Date()
            },
            emailConfirmation: {
                confirmationCode: v4(),
                expirationDate: add(new Date(), {
                    hours: 1,
                    minutes: 3,
                }),
                isConfirmed: false,
            }
        }
        const createdUser = await usersRepository.createUser(newUser)
        // тут надо отправить мыло
        let user = {id: createdUser.id, login: createdUser.accountData.userName}
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