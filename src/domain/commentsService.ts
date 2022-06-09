import {GetUserType, usersRepository} from "../repositories/usersRepository";
import {oldUserDBType} from "../repositories/types";
import {commentsRepository, CommentType, GetCommentsType} from "../repositories/commentsRepository";
import {formatISO} from "date-fns";
import {bloggersRepository} from "../repositories/bloggersRepository";
import {postsRepository} from "../repositories/postsRepository";


export const commentsService = {
    async createComment(id: string, content: string, user: oldUserDBType): Promise<CommentType | null> {
        const newComment = {
            postId: id,
            id: `${+(new Date())}`,
            content,
            userId: user.id,
            userLogin: user.login,
            addedAt: formatISO(Date.now()),
        }

        const createdComment = await commentsRepository.createComment(newComment)
        let comment = await commentsRepository.findCommentById(createdComment.id)
        return comment
    },
    async findCommentsByPostId(id: string, PageNumber?: string | null | undefined, PageSize?: string | null | undefined): Promise<GetCommentsType | null> {
        return commentsRepository.findComments(id, PageNumber, PageSize)
    },
    async findCommentById(id: string): Promise<CommentType | null> {
        return commentsRepository.findCommentById(id)
    },
    async updateComment(id: string, content: string): Promise<boolean> {
        let changedComment = await this.findCommentById(id)
        if (changedComment) {
            changedComment.content = content
        }
        const result = await commentsRepository.updateComment(id, changedComment || null)
        return result
    },
    async deleteComment(id: string): Promise<boolean> {
        const result = await commentsRepository.deleteComment(id)
        return result
    },
    async deleteAllComments(): Promise<boolean> {
        const result = await commentsRepository.deleteComment()
        return result
    },
}