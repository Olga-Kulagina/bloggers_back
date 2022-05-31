import {bloggersRepository, BloggerType, GetBloggerType} from "../repositories/bloggersRepository";
import {GetUserType, usersRepository, UserType} from "../repositories/usersRepository";


export const usersService = {
    async findUsers(PageNumber?: string | null | undefined, PageSize?: string | null | undefined): Promise<GetUserType> {
        return usersRepository.findUsers(PageNumber, PageSize)
    },
    async findUserById(id: string): Promise<UserType | null> {
        return usersRepository.findUserById(id)
    },
    async createUser(login: string, password: string): Promise<UserType | null> {
        const newUser = {
            id: `${+(new Date())}`,
            login: login,
            password: password,
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