import {Request, Response, Router} from "express";
import {error} from "../index";
import {bloggers} from "./bloggersRouter";
import {bloggersService} from "../domain/bloggersService";
import {postsService} from "../domain/postsService";
import {authBasicMiddleware} from "../middlewares/authBasicMiddleware";
import {authBearerMiddleware} from "../middlewares/authBearerMiddleware";
import {usersService} from "../domain/usersService";
import {commentsService} from "../domain/commentsService";


export const postsRouter = Router({})

let posts = [
    {
        id: 1,
        title: "01 - Введение / Back-end - Путь Самурая",
        shortDescription: "Back-end Путь Самурая",
        content: "https://www.youtube.com/watch?v=cHVhpNrjcPs",
        bloggerId: 1,
        bloggerName: "IT-KAMASUTRA"
    },
    {
        id: 2,
        title: "02 - front-end vs back-end, что выбрать / Back-end - Путь Самурая",
        shortDescription: "Back-end Путь Самурая",
        content: "https://www.youtube.com/watch?v=ugfE0ttbstQ",
        bloggerId: 1,
        bloggerName: "IT-KAMASUTRA"
    },
    {
        id: 3,
        title: "Поговорим за жизнь",
        shortDescription: "Кругом проблемы: семья, отношения, начальник дурак, работник козел...",
        content: "https://www.youtube.com/watch?v=DSl2Mkcynys&t=12090s",
        bloggerId: 2,
        bloggerName: "Egor Malkevich"
    },
    {
        id: 4,
        title: "НОВЫЙ REACT 18 ВЫШЕЛ",
        shortDescription: "В этом ролике мы посмотрим новые фичи React 18",
        content: "https://www.youtube.com/watch?v=qdCGwwSefX8&t=881s",
        bloggerId: 3,
        bloggerName: "Ulbi TV"
    },
    {
        id: 5,
        title: "Грибы научились разговаривать / Найдены штаны 3000-летней давности / Дровосеки отжали лося у медведя",
        shortDescription: "Самые честные новости",
        content: "https://www.youtube.com/watch?v=H-C3ECu8b14",
        bloggerId: 5,
        bloggerName: "Артемий Лебедев"
    },
]

postsRouter.get('/', async (req: Request, res: Response) => {
    const posts = await postsService.findPosts(req.query.title?.toString(), req.query.PageNumber?.toString(), req.query.PageSize?.toString())
    res.send(posts)
})
postsRouter.get('/:postId', async (req: Request, res: Response) => {
    let foundPost = await postsService.findPostById(req.params.postId)
    if (foundPost) {
        res.send(foundPost)
    } else {
        res.send(404)
    }
})
postsRouter.post('/', authBasicMiddleware, async (req: Request, res: Response) => {
    let errorMessages = []
    const id = req.body.bloggerId
    const isBloggerExist = await bloggersService.findBloggerById(id)
    if (!isBloggerExist) {
        errorMessages.push({
            "message": "Некорректно указано bloggerId",
            "field": "bloggerId",
        })
    }
    if (!req.body.title || !req.body.title.trim() || req.body.title.length > 30) {
        errorMessages.push({
            "message": "Некорректно указано title",
            "field": "title",
        })
    }
    if (!req.body.shortDescription || !req.body.shortDescription.trim() || req.body.shortDescription.length > 100) {
        errorMessages.push({
            "message": "Некорректно указано shortDescription",
            "field": "shortDescription",
        })
    }
    if (!req.body.content || !req.body.content.trim() || req.body.content.length > 1000) {
        errorMessages.push({
            "message": "Некорректно указано content",
            "field": "content",
        })
    }
    if (errorMessages.length > 0) {
        res.status(400).send(error(errorMessages))
    } else {
        let newPost = await postsService.createPost(req.body.title, req.body.shortDescription, req.body.content, req.body.bloggerId)
        res.status(201).send(newPost)
    }
})
postsRouter.put('/:postId', authBasicMiddleware, async (req: Request, res: Response) => {
    let errorMessages = []
    const id = req.params.postId
    const isPostExist = await postsService.findPostById(id)
    if (!isPostExist) {
        res.send(404)
    } else {
        const isBloggerExist = await bloggersService.findBloggerById(req.body.bloggerId)
        if (!isBloggerExist) {
            errorMessages.push({
                "message": "Некорректно указано bloggerId",
                "field": "bloggerId",
            })
        }
        if (!req.body.title || !req.body.title.trim() || req.body.title.length > 30) {
            errorMessages.push({
                "message": "Некорректно указано title",
                "field": "title",
            })
        }
        if (!req.body.shortDescription || !req.body.shortDescription.trim() || req.body.shortDescription.length > 100) {
            errorMessages.push({
                "message": "Некорректно указано shortDescription",
                "field": "shortDescription",
            })
        }
        if (!req.body.content || !req.body.content.trim() || req.body.content.length > 1000) {
            errorMessages.push({
                "message": "Некорректно указано content",
                "field": "content",
            })
        }
        if (errorMessages.length > 0) {
            res.status(400).send(error(errorMessages))
        } else {
            let result = await postsService.updatePost(id, req.body.title, req.body.shortDescription, req.body.content, req.body.bloggerId)
            res.send(204)
        }
    }
})
postsRouter.delete('/:postId', authBasicMiddleware, async (req: Request, res: Response) => {
    const id = req.params.postId
    const isPostExist = await postsService.findPostById(id)
    if (isPostExist) {
        const result = await postsService.deletePost(id)
        res.send(204)
    } else {
        res.send(404)
    }
})
postsRouter.delete('/', authBasicMiddleware, async (req: Request, res: Response) => {
        const result = await postsService.deleteAllPosts()
        res.send(204)
})

postsRouter.post('/:postId/comments', authBearerMiddleware, async (req: Request, res: Response) => {
    let errorMessages = []
    const id = req.params.postId
    const isPostExist = await postsService.findPostById(id)
    if (!isPostExist) {
        errorMessages.push({
            "message": "Некорректно указано postId",
            "field": "postId",
        })
    }
    if (!req.body.content || !req.body.content.trim() || req.body.content.length > 300 || req.body.content.length < 20) {
        errorMessages.push({
            "message": "Некорректно указано content",
            "field": "content",
        })
    }
    if (errorMessages.length > 0) {
        res.status(400).send(error(errorMessages))
    } else {
        let newComment = await commentsService.createComment(id, req.body.content, req.user)
        res.status(201).send(newComment)
    }
})

postsRouter.get('/:postId/comments', async (req: Request, res: Response) => {
    let errorMessages = []
    const id = req.params.postId
    const isPostExist = await postsService.findPostById(id)
    if (!isPostExist) {
        errorMessages.push({
            "message": "Некорректно указано postId",
            "field": "postId",
        })
    }
    if (errorMessages.length > 0) {
        res.status(400).send(error(errorMessages))
    } else {
        const foundComments = await commentsService.findCommentsByPostId(id, req.query.PageNumber?.toString(), req.query.PageSize?.toString())
        res.send(foundComments)
    }
})
