import {UserDBType} from '../repositories/types'
import {ObjectId} from 'mongodb'
import bcrypt from 'bcrypt'
import {jwtUtility} from '../application/jwt-utility'
import {usersRepository} from "../repositories/usersRepository";

export const authService = {
    async generateHash(password: string) {
        const hash = await bcrypt.hash(password, 10)
        return hash
    },
    async isPasswordCorrect(password: string, hash: string) {
        const compareResult: boolean = await bcrypt.compare(password, hash)
        return compareResult
    },
}
