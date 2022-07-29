import {tokensCollection} from "./db";

export type UsersTokensType = {
    userId: string,
    accessToken: string
    refreshToken: string
}

export const tokensRepository = {
    async createTokens(tokens: UsersTokensType): Promise<UsersTokensType> {
        const result = await tokensCollection.insertOne(tokens)
        return tokens
    },
    async updateTokens(tokens: UsersTokensType): Promise<UsersTokensType> {
        const result = await tokensCollection.updateOne({userId: tokens.userId}, {$set: {userId: tokens.userId, accessToken: tokens.accessToken, refreshToken: tokens.refreshToken}})
        return tokens
    },
    async isValidRefreshToken(id: string, token: string): Promise<boolean> {
        const result = await tokensCollection.findOne({id: id}, {projection: {_id: 0}})
        if (result?.refreshToken === token) {
            return true
        } else {
            return false
        }

    },

}
