import {Request, Response, Router} from "express";
import {bloggersService} from "../domain/bloggersService";
import {bloggersRouter} from "./bloggersRouter";
import {usersService} from "../domain/usersService";
import {error} from "../index";


export const usersRouter = Router({})

usersRouter.get('/', async (req: Request, res: Response) => {
    const foundUsers = await usersService.findUsers(req.query.PageNumber?.toString(), req.query.PageSize?.toString())
    res.send(foundUsers)
})
usersRouter.post('/', async (req: Request, res: Response) => {
    let errorMessages = []
    if (!req.body.login || !req.body.login.trim() || req.body.login.length > 10 || req.body.login.length < 3) {
        errorMessages.push({
            "message": "Некорректно указано login",
            "field": "login",
        })
    }
    if (!req.body.password || !req.body.password.trim() || req.body.password.length > 20 || req.body.password.length < 6) {
        errorMessages.push({
            "message": "Некорректно указано password",
            "field": "password",
        })
    }
    if (errorMessages.length > 0) {
        res.status(400).send(error(errorMessages))
    } else {
        let newUser = await usersService.createUser(req.body.login, req.body.password)
        res.status(201).send(newUser)
    }
})
usersRouter.delete('/:userId', async (req: Request, res: Response) => {
    const id = req.params.userId
    const isUserExist = await usersService.findUserById(id)
    if (isUserExist) {
        const result = await usersService.deleteUser(id)
        res.send(204)
    } else {
        res.send(404)
    }
})
usersRouter.delete('/', async (req: Request, res: Response) => {
    const result = await usersService.deleteAllUsers()
    res.send(204)
})