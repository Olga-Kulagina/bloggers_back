import {requestCountCollection} from "./db";

export type RequestItemType = {
    id: string
    ip: string
    time: number
}

export const requestCountRepository = {

    async createRequestItem(requestItem: RequestItemType): Promise<RequestItemType> {
        const result = await requestCountCollection.insertOne(requestItem)
        return requestItem
    },

}
