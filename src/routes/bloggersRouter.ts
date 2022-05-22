import {Request, Response, Router} from "express";
import {error} from "../index";
import {bloggersService} from "../domain/bloggersService";
import {postsService} from "../domain/postsService";

export const bloggersRouter = Router({})

export let bloggers = [
    {id: 1, name: 'IT-KAMASUTRA', youtubeUrl: 'https://www.youtube.com/channel/UCTW0FUhT0m-Bqg2trTbSs0g'},
    {id: 2, name: 'Egor Malkevich', youtubeUrl: 'https://www.youtube.com/channel/UCOoZWIvTu-onaFbm0YUyY0A'},
    {id: 3, name: 'Ulbi TV', youtubeUrl: 'https://www.youtube.com/channel/UCDzGdB9TTgFm8jRXn1tBdoA'},
    {id: 4, name: 'АйТиБорода', youtubeUrl: 'https://www.youtube.com/c/ITBEARD'},
    {id: 5, name: 'Артемий Лебедев', youtubeUrl: 'https://www.youtube.com/user/temalebedev'},
]

bloggersRouter.get('/', async (req: Request, res: Response) => {
    const foundBloggers = await bloggersService.findBloggers(req.query.SearchNameTerm?.toString(), req.query.PageNumber?.toString(), req.query.PageSize?.toString())
    res.send(foundBloggers)
})
bloggersRouter.get('/:bloggerId', async (req: Request, res: Response) => {
    let foundBlogger = await bloggersService.findBloggerById(+req.params.bloggerId)
    if (foundBlogger) {
        res.send(foundBlogger)
    } else {
        res.send(404)
    }
})
bloggersRouter.get('/:bloggerId/posts', async (req: Request, res: Response) => {
    let foundPosts = await postsService.findPostsByBloggerId(+req.params.bloggerId, req.query.PageNumber?.toString(), req.query.PageSize?.toString())
    res.send(foundPosts)
})
bloggersRouter.post('/', async (req: Request, res: Response) => {
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
    } else {
        let newBlogger = await bloggersService.createBlogger(req.body.name, req.body.youtubeUrl)
        res.status(201).send(newBlogger)
    }
})
bloggersRouter.put('/:bloggerId', async (req: Request, res: Response) => {
    let errorMessages = []
    const id = +req.params.bloggerId
    const blogger = await bloggersService.findBloggerById(id)
    if (!blogger) {
        res.send(404)
    } else {
        if (!req.body.name || !req.body.name.trim() || req.body.name.length > 15) {
            errorMessages.push({
                "message": "Некорректно указано name",
                "field": "name",
            })
        }
        let regexp = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/
        if (!req.body.youtubeUrl || !regexp.test(req.body.youtubeUrl) || req.body.youtubeUrl.length > 100) {
            errorMessages.push({
                "message": "Некорректно указано youtubeUrl",
                "field": "youtubeUrl",
            })
        }
        if (errorMessages.length > 0) {
            res.status(400).send(error(errorMessages))
        } else {
            let result = await bloggersService.updateBlogger(+req.params.bloggerId, req.body.name, req.body.youtubeUrl)
            res.send(204)
        }
    }
})
bloggersRouter.delete('/:bloggerId', async (req: Request, res: Response) => {
    const id = +req.params.bloggerId
    const isBloggerExist = await bloggersService.findBloggerById(id)
    if (isBloggerExist) {
        const result = await bloggersService.deleteBlogger(id)
        res.send(204)
    } else {
        res.send(404)
    }
})
bloggersRouter.delete('/', async (req: Request, res: Response) => {
        const result = await bloggersService.deleteAllBloggers()
        res.send(204)
})