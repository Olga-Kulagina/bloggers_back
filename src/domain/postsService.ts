import {GetPostType, postsRepository, PostType} from "../repositories/postsRepository";
import {bloggers} from "../routes/bloggersRouter";
import {bloggersRepository, BloggerType} from "../repositories/bloggersRepository";
import {commentsRepository, CommentType} from "../repositories/commentsRepository";
import {formatISO} from 'date-fns'
import {oldUserDBType} from "../repositories/types";

export const postsService = {
    async findPosts(title: string | null | undefined, PageNumber?: string | null | undefined, PageSize?: string | null | undefined): Promise<GetPostType> {
        return postsRepository.findPosts(title, PageNumber, PageSize)
    },
    async findPostById(id: string): Promise<PostType | null> {
        return postsRepository.findPostById(id)
    },
    async createPost(title: string, shortDescription: string, content: string, blogId: string): Promise<PostType | null> {
        const blogger = await bloggersRepository.findBloggerById(blogId)
        let blogName
        if (blogger) {
            blogName = blogger.name
        } else {
            blogName = ""
        }
        const newPost = {
            id: `${+(new Date())}`,
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: blogId,
            blogName: blogName,
        }
        const createdPost = await postsRepository.createPost(newPost)
        let post = await postsRepository.findPostById(createdPost.id)
        return post
    },
    async updatePost(id: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean> {
        const blogger = await bloggersRepository.findBloggerById(blogId)
        let blogName
        if (blogger) {
            blogName = blogger.name
        } else {
            blogName = ""
        }
        const result = await postsRepository.updatePost(id, title, shortDescription, content, blogId, blogName)
        return result
    },
    async deletePost(id: string): Promise<boolean> {
        const result = await postsRepository.deletePost(id)
        return result
    },
    async deleteAllPosts(): Promise<boolean> {
        const result = await postsRepository.deletePost()
        return result
    },
    async findPostsByBloggerId(id: string, PageNumber?: string | null | undefined, PageSize?: string | null | undefined): Promise<GetPostType | null> {
        return await postsRepository.findPostsByBloggerId(id, PageNumber, PageSize)
    }
}
