import {bloggersCollection, postsCollection} from "./db";

export type PostType = {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
}

export type GetPostType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: Array<PostType>
}

export const postsRepository = {
    async findPosts(title: string | null | undefined, PageNumber?: string | null | undefined, PageSize?: string | null | undefined, sortBy?: string | null | undefined, sortDirection?: string | null | undefined): Promise<GetPostType> {
        const filter: any = {}
        if (title) {
            filter.name = {$regex: title}
        }
        let a = PageNumber || 1
        let b = PageSize || 10
        let totalCount = await postsCollection.count({})
        let sortingValue = sortBy || "createdAt"
        let items
        if (sortDirection === "asc") {
            items = await postsCollection.find(filter, {projection: {_id: 0}}).sort({[sortingValue]: 1}).skip((+a - 1) * +b).limit(+b).toArray()
        } else {
            items = await postsCollection.find(filter, {projection: {_id: 0}}).sort({[sortingValue]: -1}).skip((+a - 1) * +b).limit(+b).toArray()
        }

        return {
            "pagesCount": Math.ceil(totalCount / +b),
            "page": +a,
            "pageSize": +b,
            "totalCount": totalCount,
            "items": items
        }
    },
    async findPostsByBloggerId(id: string, PageNumber?: string | null | undefined, PageSize?: string | null | undefined, sortBy?: string | null | undefined, sortDirection?: string | null | undefined): Promise<GetPostType | null> {
        let a = PageNumber || 1
        let b = PageSize || 10
        let totalCount = await postsCollection.count({blogId: id})

        let sortingValue = sortBy || "createdAt"
        let items
        if (sortDirection === "asc") {
            items = await postsCollection.find({blogId: id}, {projection: {_id: 0}}).sort({[sortingValue]: 1}).skip((+a - 1) * +b).limit(+b).toArray()
        } else {
            items = await postsCollection.find({blogId: id}, {projection: {_id: 0}}).sort({[sortingValue]: -1}).skip((+a - 1) * +b).limit(+b).toArray()
        }

        if (items.length > 0 && PageSize) {
            return {
                "pagesCount": Math.ceil(totalCount / +b),
                "page": +a,
                "pageSize": +b,
                "totalCount": totalCount,
                "items": items
            }
        } else if (items.length > 0) {
            return {
                "pagesCount": Math.ceil(totalCount / +b),
                "page": +a,
                "pageSize": +b,
                "totalCount": totalCount,
                "items": items
            }
        } else {
            return null
        }

    },
    async findPostById(id: string): Promise<PostType | null> {
        let post = await postsCollection.findOne({id: id}, {projection: {_id: 0}})
        return post
    },
    async createPost(newPost: PostType): Promise<PostType> {
        const result = await postsCollection.insertOne(newPost)
        return newPost
    },
    async updatePost(id: string, title: string, shortDescription: string, content: string, blogId: string, blogName: string): Promise<boolean> {
        const result = await postsCollection.updateOne({id: id}, {
            $set: {
                title: title,
                shortDescription: shortDescription,
                content: content,
                blogId: blogId,
                blogName: blogName
            }
        })
        return result.matchedCount === 1
    },
    async deletePost(id?: string): Promise<boolean> {
        let result
        if (id) {
            result = await postsCollection.deleteOne({id: id})
        } else {
            result = await postsCollection.deleteMany({})
        }
        return result.deletedCount === 1
    }
}
