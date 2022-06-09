import {bloggersRepository} from "../repositories/bloggersRepository";
import {postsRepository} from "../repositories/postsRepository";
import {usersRepository} from "../repositories/usersRepository";
import {commentsRepository} from "../repositories/commentsRepository";

export const testingService = {
    async deleteAllData(): Promise<boolean> {
        const result1 = await bloggersRepository.deleteBlogger()
        const result2 = await postsRepository.deletePost()
        const result3 = await usersRepository.deleteUser()
        const result4 = await commentsRepository.deleteComment()
        return result1 && result2 && result3 && result4
    }
}
