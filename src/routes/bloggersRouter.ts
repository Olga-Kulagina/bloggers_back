import {Request, Response, Router} from "express";
import {error} from "../index";

export const bloggersRouter = Router({})

export let bloggers = [
    {id: 1, name: 'IT-KAMASUTRA', youtubeUrl: 'https://www.youtube.com/channel/UCTW0FUhT0m-Bqg2trTbSs0g'},
    {id: 2, name: 'Egor Malkevich', youtubeUrl: 'https://www.youtube.com/channel/UCOoZWIvTu-onaFbm0YUyY0A'},
    {id: 3, name: 'Ulbi TV', youtubeUrl: 'https://www.youtube.com/channel/UCDzGdB9TTgFm8jRXn1tBdoA'},
    {id: 4, name: 'АйТиБорода', youtubeUrl: 'https://www.youtube.com/c/ITBEARD'},
    {id: 5, name: 'Артемий Лебедев', youtubeUrl: 'https://www.youtube.com/user/temalebedev'},
]

bloggersRouter.get('/', (req: Request, res: Response) => {
    res.send(bloggers)
})
bloggersRouter.get('/:bloggerId', (req: Request, res: Response) => {
    const id = +req.params.bloggerId
    const isBloggerExist = bloggers.findIndex(b => b.id === id) !== -1
    if (isBloggerExist) {
        const blogger = bloggers.find(b => b.id === id)
        res.send(blogger)
    } else {
        res.send(404)
    }
})
bloggersRouter.post('/', (req: Request, res: Response) => {
    let errorMessages = []
    if (!req.body.name || !req.body.name.trim() || req.body.name.length > 15) {
        errorMessages.push({
            "message": "Некорректно указано name",
            "field": "name",
        })
    }
    let regexp = /https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?/
    if (!req.body.youtubeUrl || !regexp.test(req.body.youtubeUrl) || req.body.youtubeUrl.length > 100) {
        errorMessages.push({
            "message": "Некорректно указано youtubeUrl",
            "field": "youtubeUrl",
        })
    }
    if (errorMessages.length > 0) {
        res.status(400).send(error(errorMessages))
    }
    const newBlogger = {
        id: +(new Date()),
        name: req.body.name,
        youtubeUrl: req.body.youtubeUrl,
    }
    bloggers.push(newBlogger)
    res.status(201).send(newBlogger)
})
bloggersRouter.put('/:bloggerId', (req: Request, res: Response) => {
    let errorMessages = []
    const id = +req.params.bloggerId
    const isBloggerExist = bloggers.findIndex(b => b.id === id) !== -1
    if (!isBloggerExist) {
        res.send(404)
    }
    if (!req.body.name || !req.body.name.trim() || req.body.name.length > 15) {
        errorMessages.push({
            "message": "Некорректно указано name",
            "field": "name",
        })
    }
    let regexp = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/
    if (!req.body.youtubeUrl || !regexp.test(req.body.youtubeUrl)  || req.body.youtubeUrl.length > 100) {
        errorMessages.push({
            "message": "Некорректно указано youtubeUrl",
            "field": "youtubeUrl",
        })
    }
    if (errorMessages.length > 0) {
        res.status(400).send(error(errorMessages))
    }
    bloggers = bloggers.map(b => b.id === id ? {...b, name: req.body.name, youtubeUrl: req.body.youtubeUrl} : b)
    res.send(204)
})
bloggersRouter.delete('/:bloggerId', (req: Request, res: Response) => {
    const id = +req.params.bloggerId
    const isBloggerExist = bloggers.findIndex(b => b.id === id) !== -1
    if (isBloggerExist) {
        const index = bloggers.findIndex(b => b.id === id)
        bloggers.splice(index, 1)
        res.send(204)
    } else {
        res.send(404)
    }
})