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
            let isMore5UsersOnIp = await usersService.isMore5UsersOnIp(req.ip)
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
                res.status(400).send({errorsMessages: errorMessages})
            } else if (isMore5UsersOnIp) {
                res.send(429)
            } else {
                let newUser = await usersService.createUser(req.body.login, req.body.email, req.body.password, req.ip)
                res.status(204).send("Регистрация прошла успешно")
            }
        }
    })
/*authRouter.post('/registration-email-resending',
    async (req: Request, res: Response) => {
                let newUser = await usersService.createUser(req.body.login, req.body.email, req.body.password, req.ip)
                res.status(204).send("Регистрация прошла успешно")
        }
    })*/
authRouter.post('/registration-confirmation',
    async (req: Request, res: Response) => {
        let errorMessages = []
        if (!req.query.code) {
            errorMessages.push({
                "message": "Некорректно указано code",
                "field": "code",
            })
        }
        let userWithCode = await usersService.findUserByConfirmationCode(`${req.query.code}`)
        console.log(userWithCode)
        if (errorMessages.length > 0) {
            res.status(400).send({errorsMessages: errorMessages})
        } else if (!userWithCode) {
            res.status(400).send({
                errorsMessages: [{
                    "message": "Юзера с таким code не существует",
                    "field": "code",
                }]
            })
        } else {
            let confirmUser = await usersService.confirmUser(userWithCode.id)
            if (confirmUser) {
                res.send(204)
            } else {
                res.status(400).send({
                    errorsMessages: [{
                        "message": "Что-то пошло не так",
                        "field": "code",
                    }]
                })
            }
        }
    }
)
