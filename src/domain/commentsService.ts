import {GetUserType, usersRepository} from "../repositories/usersRepository";
import {UserDBType} from "../repositories/types";
import {commentsRepository, CommentType, GetCommentsType} from "../repositories/commentsRepository";
import {formatISO} from "date-fns";


export const commentsService = {
    async createComment(id: string, content: string, user: UserDBType): Promise<CommentType | null> {
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
    async findCommentByPostId(id: string): Promise<CommentType | null> {
        return commentsRepository.findCommentById(id)
    },
}