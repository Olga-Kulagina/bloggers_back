import {Request, Response, Router} from "express";
import {jwtUtility} from "../application/jwt-utility";
import {authService} from "../domain/authService";
import {error} from "../index";
import {usersService} from "../domain/usersService";

export const authRouter = Router({})

authRouter.post('/login',
    async (req: Request, res: Response) => {
        const user = await authService.checkCredentials(req.body.login, req.body.email, req.body.password)
        if (user) {
            const token = await jwtUtility.createJWT(user)
            res.status(200).send({token})
        } else {
            res.sendStatus(401)
        }
    })


authRouter.post('/registration',
    async (req: Request, res: Response) => {
        let errorMessages = []
        if (!req.body.login || !req.body.login.trim() || req.body.login.length > 10 || req.body.login.length < 3) {
            errorMessages.push({
                "message": "Некорректно указано login",
                "field": "login",
            })
        }
        let regexp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
        if (!req.body.email || !regexp.test(req.body.email)) {
            errorMessages.push({
                "message": "Некорректно указано email",
                "field": "email",
            })
        }
        if (!req.body.password || !req.body.password.trim() || req.body.password.length > 20 || req.body.password.length < 6) {
            errorMessages.push({
                "message": "Некорректно указано password",
                "field": "password",
            })
        }
        if (errorMessages.length > 0) {
            res.status(400).send({errorsMessages: errorMessages})
        } else {
            let user = await usersService.findByLoginOrEmail(req.body.login, req.body.email)
            if (user) {
                if (user.accountData.userName === req.body.login) {
                    errorMessages.push({
                        "message": "Некорректно указано login",
                        "field": "login",
                    })
                }
                if (user.accountData.email === req.body.email) {
                    errorMessages.push({
                        "message": "Некорректно указано email",
                        "field": "email",
                    })
                }
                res.status(400).send()
            } else {
                let newUser = await usersService.createUser(req.body.login, req.body.email, req.body.password)
                res.status(204).send("Регистрация прошла успешно")
            }
        }


    })
