import {requestCountRepository} from "../repositories/requestCountRepository";

export const requestCountService = {
    async createRequestItem(ip: string, time: number): Promise<any | null> {
        const newRequest = {
            id: `${+(new Date())}`,
            ip: ip,
            time: time,
        }
        let requestItem = await requestCountRepository.createRequestItem(newRequest)
        return requestItem
    },
}
