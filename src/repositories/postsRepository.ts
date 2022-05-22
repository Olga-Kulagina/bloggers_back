import {postsCollection} from "./db";

export type PostType = {
    id: number
    title: string
    shortDescription: string
    content: string
    bloggerId: number
    bloggerName: string
}

export const postsRepository = {
    async findPosts(title: string | null | undefined): Promise<PostType[]> {
        const filter: any = {}
        if (title) {
            filter.name = {$regex: title}
        }
        return postsCollection.find(filter).toArray()
    },
    async findPostById(id: number): Promise<PostType | null> {
        let post = await postsCollection.findOne({id: id})
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
    async deletePost(id: number): Promise<boolean> {
        let result = await postsCollection.deleteOne({id: id})
        return result.deletedCount === 1
    }
}
