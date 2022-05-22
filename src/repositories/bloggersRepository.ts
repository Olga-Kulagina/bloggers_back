import {bloggersCollection, db, postsCollection} from "./db";

export type BloggerType = {
    id: number
    name: string
    youtubeUrl: string
}

export type GetBloggerType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: Array<BloggerType>
}

export const bloggersRepository = {
    async findBloggers(SearchNameTerm: string | null | undefined, PageNumber?: string | null | undefined , PageSize?: string | null | undefined): Promise<GetBloggerType> {
        const filter: any = {}
        if (SearchNameTerm) {
            filter.name = {$regex: SearchNameTerm}
        }
        let a = PageNumber || 1
        let b = PageSize || 10
        let totalCount = await bloggersCollection.count({})
        let items = await bloggersCollection.find(filter, {projection: {_id: 0}}).skip((+a - 1) * +b).limit(+b).toArray()

        return {
            "pagesCount": Math.ceil(totalCount/+b),
            "page": +a,
            "pageSize": +b,
            "totalCount": totalCount,
            "items": items
        }
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
