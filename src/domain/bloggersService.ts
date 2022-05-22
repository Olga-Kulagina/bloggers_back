import {bloggersRepository, BloggerType} from "../repositories/bloggersRepository";

export const bloggersService = {
    async findBloggers(name: string | null | undefined): Promise<BloggerType[]> {
        return bloggersRepository.findBloggers(name)
    },
    async findBloggerById(): Promise<BloggerType | null> {
        return null
    },
    async createBlogger(): Promise<BloggerType> {
        return {id: 1, name: 'IT-KAMASUTRA', youtubeUrl: 'https://www.youtube.com/channel/UCTW0FUhT0m-Bqg2trTbSs0g'}
    },
    async updateBlogger(): Promise<boolean> {
        return true
    },
    async deleteBlogger(): Promise<boolean> {
        return true
    }
}
