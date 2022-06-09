import {oldUserDBType, UserDBType} from '../repositories/types'
import bcrypt from 'bcrypt'
import {usersService} from "./usersService";

export const authService = {
    async generateHash(password: string) {
        const hash = await bcrypt.hash(password, 10)
        return hash
    },
    async isPasswordCorrect(password: string, hash: string) {
        const compareResult: boolean = await bcrypt.compare(password, hash)
        return compareResult
    },
    /**
     *
     * @param login
     * @param password
     * @return null if credentials are incorrect and admin entity in opposite case
     */
    async checkCredentials(login: string, email: string, password: string): Promise<UserDBType | null> {
        const user = await usersService.findByLoginOrEmail(login, email)
        if (!user) {
            return null
        }
        const isPasswordCorrect = await this.isPasswordCorrect(password, user.accountData.passwordHash)
        if (isPasswordCorrect) {
            return user
        } else {
            return null
        }
    },
}
