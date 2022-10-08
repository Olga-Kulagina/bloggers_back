import {GetUserType, usersRepository, UserType} from "../repositories/usersRepository";
import {oldUserDBType, UserDBType} from "../repositories/types";
import {authService} from "./authService";
import {ObjectId} from "mongodb";
import {v4} from "uuid"
import {add} from "date-fns";
import {emailAdapter} from "../adapters/emailAdapter";


export const usersService = {
    async findUsers(PageNumber?: string | null | undefined, PageSize?: string | null | undefined): Promise<GetUserType> {
        return usersRepository.findUsers(PageNumber, PageSize)
    },
    async findUserById(id: string): Promise<UserType | null> {
        return usersRepository.findUserById(id)
    },
    async findByLoginOrEmail(login: string, email?: string): Promise<UserDBType | null> {
        return usersRepository.findByLoginOrEmail(login, email)
    },
    async isMore5UsersOnIp(ip: string, requestTime: number) {
        return usersRepository.isMore5UsersOnIp(ip, requestTime)
    },
    async isMore4UsersOnIp(ip: string, requestTime: number) {
        return usersRepository.isMore4UsersOnIp(ip, requestTime)
    },
    async isMore5UsersOnIpR(ip: string, requestTime: number) {
        return usersRepository.isMore5UsersOnIpR(ip, requestTime)
    },
    async findUserByConfirmationCode(code: string) {
        return usersRepository.findUserByConfirmationCode(code)
    },
    async setNewConfirmationCode(id: string, code: string) {
        return usersRepository.setNewConfirmationCode(id, code)
    },
    async confirmUser(id: string) {
        return usersRepository.confirmUser(id)
    },
    async createUser(login: string, email: string, password: string, ip: string): Promise<UserType | null> {
        const passwordHash = await authService.generateHash(password)
        const newUser: UserDBType = {
            _id: new ObjectId(),
            id: `${+(new Date())}`,
            accountData: {
                userName: login,
                email,
                passwordHash,
                createdAt: new Date(),
                ip: ip
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
        await emailAdapter.emailSend(email, "Регистрация", `http://localhost:5000/auth/registration-confirmation?code=${createdUser.emailConfirmation.confirmationCode}`)
        let user = {id: createdUser.id, login: createdUser.accountData.userName, email: createdUser.accountData.email, createdAt: createdUser.accountData.createdAt}
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