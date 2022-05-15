import {Request, Response, Router} from "express";
import {error} from "../index";
import {bloggers} from "./bloggersRouter";


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

postsRouter.get('/', (req: Request, res: Response) => {
    res.send(posts)
})
postsRouter.get('/:postId', (req: Request, res: Response) => {
    const id = +req.params.postId
    const isPostExist = posts.findIndex(p => p.id === id) !== -1
    if (isPostExist) {
        const post = posts.find(p => p.id === id)
        res.send(post)
    } else {
        res.send(404)
    }
})
postsRouter.post('/', (req: Request, res: Response) => {
    let errorMessages = []
    const id = +req.body.bloggerId
    const bloggerIndex = bloggers.findIndex(b => b.id === id)
    const isBloggerExist = bloggerIndex !== -1
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
    }
    const newPost = {
        id: +(new Date()),
        title: req.body.title,
        shortDescription: req.body.shortDescription,
        content: req.body.content,
        bloggerId: +req.body.bloggerId,
        bloggerName: bloggers[bloggerIndex].name,
    }
    posts.push(newPost)
    res.status(201).send(newPost)
})
postsRouter.put('/:postId', (req: Request, res: Response) => {
    let errorMessages = []
    const id = +req.params.postId
    const isPostExist = posts.findIndex(p => p.id === id) !== -1
    if (!isPostExist) {
        res.send(404)
    }
    const bloggerIndex = bloggers.findIndex(b => b.id === +req.body.bloggerId)
    const isBloggerExist = bloggerIndex !== -1
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
    }
    posts = posts.map(p => p.id === id ? {
        ...p,
        title: req.body.title,
        shortDescription: req.body.shortDescription,
        content: req.body.content,
        bloggerId: req.body.bloggerId,
        bloggerName: bloggers[bloggerIndex].name,
    } : p)
    res.send(204)
})
postsRouter.delete('/:postId', (req: Request, res: Response) => {
    const id = +req.params.postId
    const isPostExist = posts.findIndex(p => p.id === id) !== -1
    if (isPostExist) {
        const index = posts.findIndex(p => p.id === id)
        posts.splice(index, 1)
        res.send(204)
    } else {
        res.send(404)
    }
})