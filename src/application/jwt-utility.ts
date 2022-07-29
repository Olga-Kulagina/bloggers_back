import jwt from 'jsonwebtoken'
import {settings} from '../settings'
import {oldUserDBType, UserDBType} from "../repositories/types";

export const jwtUtility = {
    /**
     * @param user
     * @return Returns JWT-token
     */
    async createJWT(user: UserDBType) {
        const token = jwt.sign({userId: user.id}, settings.JWT_SECRET, {expiresIn: '10s'})
        return token
    },
    async createRefreshJWT(user: UserDBType) {
        const refreshToken = jwt.sign({userId: user.id}, settings.REFRESH_JWT_SECRET, {expiresIn: '20s'})
        return refreshToken
    },
    async extractUserIdFromToken(token: string): Promise<string | null> {
        try {
            const result: any = jwt.verify(token, settings.JWT_SECRET)
            return result.userId
        } catch (error) {
            return null
        }
    },
    async getExpiredTime(token: string): Promise<string | null> {
        try {
            const result: any = jwt.verify(token, settings.JWT_SECRET)
            return result.exp
        } catch (error) {
            return null
        }
    }
}
