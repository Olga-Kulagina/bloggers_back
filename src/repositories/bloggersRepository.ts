import {bloggersCollection, db, postsCollection} from "./db";

export type BloggerType = {
    id: number
    name: string
    youtubeUrl: string
}

export const bloggersRepository = {
    async findBloggers(SearchNameTerm: string | null | undefined, PageNumber?: number , PageSize?: number): Promise<BloggerType[]> {
        const filter: any = {}
        if (SearchNameTerm) {
            filter.name = {$regex: SearchNameTerm}
        }
        console.log(await bloggersCollection.count({}))
        return bloggersCollection.find(filter, {projection: {_id: 0}}).toArray()
        /*{
            "pagesCount": 0,
            "page": 0,
            "pageSize": 0,
            "totalCount": 0,
            "items": [
            {
                "id": 0,
                "name": "string",
                "youtubeUrl": "string"
            }
        ]
        }*/
    },
    async findBloggerById(id: number): Promise<BloggerType | null> {
        let blogger = await bloggersCollection.findOne({id: id}, {projection: {_id: 0}})
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
