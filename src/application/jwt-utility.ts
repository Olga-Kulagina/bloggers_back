import jwt from 'jsonwebtoken'
import {settings} from '../settings'
import {UserDBType} from "../repositories/types";

export const jwtUtility = {
    /**
     * @param user
     * @return Returns JWT-token
     */
    async createJWT(user: UserDBType) {
        const token = jwt.sign({userId: user._id}, settings.JWT_SECRET, {expiresIn: '1h'})
        return token
    },
}
