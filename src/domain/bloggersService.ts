import {bloggersRepository, BloggerType} from "../repositories/bloggersRepository";

export const bloggersService = {
    async findBloggers(name: string | null | undefined): Promise<BloggerType[]> {
        return bloggersRepository.findBloggers(name)
    },
    async findBloggerById(id: number): Promise<BloggerType | null> {
        return bloggersRepository.findBloggerById(id)
    },
    async createBlogger(name: string, youtubeUrl: string): Promise<BloggerType> {
        const newBlogger = {
            id: +(new Date()),
            name: name,
            youtubeUrl: youtubeUrl,
        }
        const createdBlogger = await bloggersRepository.createBlogger(newBlogger)
        return createdBlogger
    },
    async updateBlogger(id: number, name: string, youtubeUrl: string): Promise<boolean> {
        const result = await bloggersRepository.updateBlogger(id, name, youtubeUrl)
        return result
    },
    async deleteBlogger(id: number): Promise<boolean> {
        const result = await bloggersRepository.deleteBlogger(id)
        return result
    }
}
