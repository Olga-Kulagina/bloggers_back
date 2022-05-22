import {postsRepository, PostType} from "../repositories/postsRepository";
import {bloggers} from "../routes/bloggersRouter";
import {bloggersRepository, BloggerType} from "../repositories/bloggersRepository";

export const postsService = {
    async findPosts(title: string | null | undefined): Promise<PostType[]> {
        return postsRepository.findPosts(title)
    },
    async findPostById(id: number): Promise<PostType | null> {
        return postsRepository.findPostById(id)
    },
    async createPost(title: string, shortDescription: string, content: string, bloggerId: number): Promise<PostType | null> {
        const blogger = await bloggersRepository.findBloggerById(bloggerId)
        let bloggerName
        if (blogger) {
            bloggerName = blogger.name
        } else {
            bloggerName = ""
        }
        const newPost = {
            id: +(new Date()),
            title: title,
            shortDescription: shortDescription,
            content: content,
            bloggerId: bloggerId,
            bloggerName: bloggerName,
        }
        const createdPost = await postsRepository.createPost(newPost)
        let post = await postsRepository.findPostById(createdPost.id)
        return post
    },
    async updatePost(id: number, title: string, shortDescription: string, content: string, bloggerId: number): Promise<boolean> {
        const blogger = await bloggersRepository.findBloggerById(bloggerId)
        let bloggerName
        if (blogger) {
            bloggerName = blogger.name
        } else {
            bloggerName = ""
        }
        const result = await postsRepository.updatePost(id, title, shortDescription, content, bloggerId, bloggerName)
        return result
    },
     async deletePost(id: number): Promise<boolean> {
       const result = await postsRepository.deletePost(id)
       return result
   },
   async deleteAllPosts(): Promise<boolean> {
       const result = await postsRepository.deletePost()
       return result
   }
}
