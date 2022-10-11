import {bloggersCollection, commentsCollection, postsCollection, usersCollection} from "./db";
import {UserType} from "./usersRepository";


export type CommentType = {
    postId: string
    id: string
    content: string
    userId: string
    userLogin: string
    createdAt: string
}

export type GetCommentsType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: Array<CommentType>
}

export const commentsRepository = {
    async createComment(newComment: CommentType): Promise<CommentType> {
        const result = await commentsCollection.insertOne(newComment)
        return newComment
    },
    async findCommentById(id: string): Promise<CommentType | null> {
        const comment = await commentsCollection.findOne({id: id}, {projection: {_id: 0, postId: 0}})
        return comment
    },
    async findComments(id: string, PageNumber?: string | null | undefined , PageSize?: string | null | undefined, sortBy?: string | null | undefined, sortDirection?: string | null | undefined): Promise<GetCommentsType | null> {
        let a = PageNumber || 1
        let b = PageSize || 10
        let comments = await commentsCollection.find({postId: id}, {projection: {_id: 0}}).toArray()

        let sortingValue = sortBy || "createdAt"
        let items
        if (sortDirection === "asc") {
            items = await commentsCollection.find({postId: id}, {projection: {_id: 0, postId: 0}}).sort({[sortingValue]: 1}).skip((+a - 1) * +b).limit(+b).toArray()
        } else {
            items = await commentsCollection.find({postId: id}, {projection: {_id: 0, postId: 0}}).sort({[sortingValue]: -1}).skip((+a - 1) * +b).limit(+b).toArray()
        }

        return {
            "pagesCount": Math.ceil(comments.length/+b),
            "page": +a,
            "pageSize": +b,
            "totalCount": comments.length,
            "items": items
        }
    },
    async updateComment(id: string, comment: CommentType | null): Promise<boolean> {
        const result = await commentsCollection.updateOne({id: id}, {$set: {...comment}})
        return result.matchedCount === 1
    },
    async deleteComment(id?: string): Promise<boolean> {
        let result
        if (id) {
            result = await commentsCollection.deleteOne({id: id})
        } else {
            result = await commentsCollection.deleteMany({})
        }
        return result.deletedCount === 1
    }
}