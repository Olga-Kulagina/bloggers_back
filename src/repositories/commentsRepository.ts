import {commentsCollection, postsCollection} from "./db";
import {GetPostType, PostType} from "./postsRepository";


export type CommentType = {
    id: string
    content: string
    userId: string
    userLogin: string
    addedAt: string
}

export const commentsRepository = {
    async createComment(newComment: CommentType): Promise<CommentType> {
        const result = await commentsCollection.insertOne(newComment)
        return newComment
    },
    async findCommentById(id: string): Promise<CommentType | null> {
        const comment = await commentsCollection.findOne({id: id}, {projection: {_id: 0}})
        return comment
    },
}