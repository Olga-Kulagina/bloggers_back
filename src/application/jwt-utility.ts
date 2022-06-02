import jwt from 'jsonwebtoken'
import {settings} from '../settings'
import {UserDBType} from "../repositories/types";

export const jwtUtility = {
    /**
     * @param user
     * @return Returns JWT-token
     */
    async createJWT(user: UserDBType) {
        const token = jwt.sign({userId: user.id}, settings.JWT_SECRET, {expiresIn: '1h'})
        return token
    },
    async extractUserIdFromToken(token: string): Promise<string | null> {
        try {
            const result: any = jwt.verify(token, settings.JWT_SECRET)
            return result.userId
        } catch (error) {
            return null
        }
    }
}
