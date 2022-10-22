import jwt from 'jsonwebtoken'
import {settings} from '../settings'
import {oldUserDBType, UserDBType} from "../repositories/types";

export const jwtUtility = {
    /**
     * @param user
     * @return Returns JWT-token
     */
    async createJWT(userId: string) {
        const token = jwt.sign({userId: userId}, settings.JWT_SECRET, {expiresIn: '10s'})
        return token
    },
    async createRefreshJWT(userId: string) {
        const refreshToken = jwt.sign({userId: userId}, settings.REFRESH_JWT_SECRET, {expiresIn: '20s'})
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
    },
    async getExpiredTimeForRefresh(token: string): Promise<string | null> {
        try {
            const result: any = jwt.verify(token, settings.REFRESH_JWT_SECRET)
            return result.exp
        } catch (error) {
            return null
        }
    },
    async verifyRefreshToken(token: string): Promise<boolean> {
        try {
            const result: any = jwt.verify(token, settings.REFRESH_JWT_SECRET)
            return true
        } catch (error) {
            return false
        }
    },
    async getUserFromRefreshJWT(refreshToken: string): Promise<string | null> {
        try {
            const result: any = jwt.verify(refreshToken, settings.REFRESH_JWT_SECRET)
            return result.userId
        } catch (error) {
            return null
        }
    },
}
