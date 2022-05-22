import {bloggersCollection, postsCollection} from "./db";

export type BloggerType = {
    id: number
    name: string
    youtubeUrl: string
}

export const bloggersRepository = {
    async findBloggers(name: string | null | undefined): Promise<BloggerType[]> {
        const filter: any = {}
        if (name) {
            filter.name = {$regex: name}
        }
        return bloggersCollection.find(filter).toArray()
    },
    async findBloggerById(id: number): Promise<BloggerType | null> {
        let blogger = await bloggersCollection.findOne({id: id})
        return blogger
    },
    async createBlogger(newBlogger: BloggerType): Promise<BloggerType> {
        const result = await bloggersCollection.insertOne(newBlogger)
        return newBlogger
    },
    async updateBlogger(id: number, name: string, youtubeUrl: string): Promise<boolean> {
        const result = await bloggersCollection.updateOne({id: id}, {$set: {name: name, youtubeUrl: youtubeUrl}})
        return result.matchedCount === 1
    },
    async deleteBlogger(id?: number): Promise<boolean> {
        let result
        if (id) {
            result = await bloggersCollection.deleteOne({id: id})
        } else {
            result = await bloggersCollection.deleteMany({})
        }
        return result.deletedCount === 1
    }
}
