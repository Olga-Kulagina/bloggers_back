import {bloggersCollection, postsCollection} from "./db";
import {BloggerType} from "./bloggersRepository";

export type PostType = {
    id: number
    title: string
    shortDescription: string
    content: string
    bloggerId: number
    bloggerName: string
}

export type GetPostType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: Array<PostType>
}

export const postsRepository = {
    async findPosts(title: string | null | undefined, PageNumber?: string | null | undefined , PageSize?: string | null | undefined): Promise<GetPostType> {
        const filter: any = {}
        if (title) {
            filter.name = {$regex: title}
        }
        let a = PageNumber || 1
        let b = PageSize || 10
        let totalCount = await postsCollection.count({})
        let items = await postsCollection.find(filter, {projection: {_id: 0}}).skip((+a - 1) * +b).limit(+b).toArray()

        return {
            "pagesCount": Math.ceil(totalCount/+b),
            "page": +a,
            "pageSize": +b,
            "totalCount": totalCount,
            "items": items
        }
    },
    async findPostById(id: number): Promise<PostType | null> {
        let post = await postsCollection.findOne({id: id}, {projection: {_id: 0}})
        return post
    },
    async createPost(newPost: PostType): Promise<PostType> {
        const result = await postsCollection.insertOne(newPost)
        return newPost
    },
    async updatePost(id: number, title: string, shortDescription: string, content: string, bloggerId: number, bloggerName: string): Promise<boolean> {
        const result = await postsCollection.updateOne({id: id}, {$set: {title: title, shortDescription: shortDescription, content: content, bloggerId: bloggerId, bloggerName: bloggerName}})
        return result.matchedCount === 1
    },
    async deletePost(id?: number): Promise<boolean> {
        let result
        if (id) {
            result = await postsCollection.deleteOne({id: id})
        } else {
            result = await postsCollection.deleteMany({})
        }
        return result.deletedCount === 1
    }
}
