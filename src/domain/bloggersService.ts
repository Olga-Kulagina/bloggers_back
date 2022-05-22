import {bloggersRepository, BloggerType} from "../repositories/bloggersRepository";

export const bloggersService = {
    async findBloggers(SearchNameTerm: string | null | undefined, PageNumber?: number, PageSize?: number): Promise<BloggerType[]> {
        return bloggersRepository.findBloggers(SearchNameTerm, PageNumber, PageSize)
    },
    async findBloggerById(id: number): Promise<BloggerType | null> {
        return bloggersRepository.findBloggerById(id)
    },
    async createBlogger(name: string, youtubeUrl: string): Promise<BloggerType | null> {
        const newBlogger = {
            id: +(new Date()),
            name: name,
            youtubeUrl: youtubeUrl,
        }
        const createdBlogger = await bloggersRepository.createBlogger(newBlogger)
        let blogger = await bloggersRepository.findBloggerById(createdBlogger.id)
        return blogger
    },
    async updateBlogger(id: number, name: string, youtubeUrl: string): Promise<boolean> {
        const result = await bloggersRepository.updateBlogger(id, name, youtubeUrl)
        return result
    },
    async deleteBlogger(id: number): Promise<boolean> {
        const result = await bloggersRepository.deleteBlogger(id)
        return result
    },
    async deleteAllBloggers(): Promise<boolean> {
        const result = await bloggersRepository.deleteBlogger()
        return result
    }
}
