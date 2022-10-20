import {Request, Response, Router} from "express";
import {jwtUtility} from "../application/jwt-utility";
import {authService} from "../domain/authService";
import {usersService} from "../domain/usersService";
import {emailAdapter} from "../adapters/emailAdapter";
import {v4} from "uuid";
import {requestCountService} from "../domain/requestCountService";
import {authBearerMiddleware} from "../middlewares/authBearerMiddleware";
import {tokensRepository} from "../repositories/tokensRepository";

export const authRouter = Router({})

let arrLogin: any = []

authRouter.post('/login',
    async (req: Request, res: Response) => {
        let requestTime = (new Date()).getTime()
        const user = await authService.checkCredentials(req.body.login, req.body.email, req.body.password)
        let hArrLogin = arrLogin.filter((item: any) => item.date > Date.now() - 10 * 1000)
        if (hArrLogin.length > 4) {
            res.sendStatus(429)
        } else {
            arrLogin.push({
                ip: req.ip,
                date: Date.now()
            })
            if (user) {
                const token = await jwtUtility.createJWT(user.id)
                const refreshToken = await jwtUtility.createRefreshJWT(user.id)
                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: true
                })
                await tokensRepository.createTokens({userId: user.id, accessToken: token, refreshToken: refreshToken})
                res.status(200).send({accessToken: token})
            } else {
                res.sendStatus(401)
            }
        }
    })

authRouter.get('/me', authBearerMiddleware,
    async (req: Request, res: Response) => {
        let user = await usersService.findByLoginOrEmail(req.user.login)
        if (user) {
            let userData = {
                email: user.accountData.email,
                login: user.accountData.login,
                userId: user.id,
            }
            res.status(200).send(userData)
        } else {
            res.sendStatus(401)
        }
    })

authRouter.post('/refresh-token',
    async (req: Request, res: Response) => {
            const refreshToken = req.cookies.refreshToken
            const expiredTime = await jwtUtility.getExpiredTimeForRefresh(refreshToken)
            if (expiredTime && Date.now() / 1000 > +expiredTime) {
                res.send(401)
            } else {
                const userId = await jwtUtility.getUserFromRefreshJWT(refreshToken)
                let user = {
                    id: userId as string
                }
                const isValid = await tokensRepository.isValidRefreshToken(user.id, refreshToken)
                if (!isValid) {
                    res.send(401)
                } else {
                    if (user) {
                        const token = await jwtUtility.createJWT(user.id)
                        const newRefreshToken = await jwtUtility.createRefreshJWT(user.id)
                        res.cookie('refreshToken', newRefreshToken, {
                            httpOnly: true,
                            secure: true
                        })
                        await tokensRepository.updateTokens({
                            userId: user.id,
                            accessToken: token,
                            refreshToken: refreshToken
                        })
                        res.status(200).send({accessToken: token})
                    } else {
                        res.sendStatus(401)
                    }
                }
            }
    })

authRouter.post('/logout',
    async (req: Request, res: Response) => {
            const refreshToken = req.cookies.refreshToken
            if (!refreshToken) {
                res.send(401)
            } else {
                const expiredTime = await jwtUtility.getExpiredTimeForRefresh(refreshToken)
                if (expiredTime && Date.now() / 1000 > +expiredTime) {
                    res.send(401)
                } else {
                    res.sendStatus(204)
                }
            }
    }
)

authRouter.post('/registration',
    async (req: Request, res: Response) => {
        let requestTime = (new Date()).getTime()
        await requestCountService.createRequestItem(req.ip, requestTime)
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
            let isMore5UsersOnIp = await usersService.isMore5UsersOnIp(req.ip, requestTime)
            if (user) {
                if (user.accountData.login === req.body.login) {
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
                res.send(204)
            }
        }
    })

authRouter.post('/registration-confirmation',
    async (req: Request, res: Response) => {
        let errorMessages = []
        if (!req.body.code) {
            errorMessages.push({
                "message": "Некорректно указано code",
                "field": "code",
            })
        }
        let userWithCode = await usersService.findUserByConfirmationCode(`${req.body.code}`)
        if (errorMessages.length > 0) {
            res.status(400).send({errorsMessages: errorMessages})
        } else if (!userWithCode) {
            res.status(400).send({
                errorsMessages: [{
                    "message": "Юзера с таким code не существует",
                    "field": "code",
                }]
            })
        } else if (userWithCode.emailConfirmation.isConfirmed) {
            res.status(400).send({
                errorsMessages: [{
                    "message": "Юзер с таким code уже подтвержден",
                    "field": "code",
                }]
            })
            return
        } else {
            let confirmUser = await usersService.confirmUser(userWithCode.id)
            if (confirmUser) {
                await emailAdapter.emailSend(userWithCode.accountData.email, "Регистрация подтверждена", `Вы успешно зарегистрировались!`)
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

let arr: any = []

authRouter.post('/registration-email-resending',
    async (req: Request, res: Response) => {
        let requestTime = (new Date()).getTime()
        await requestCountService.createRequestItem(req.ip, requestTime)
        let errorMessages = []
        let regexp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
        if (!req.body.email || !regexp.test(req.body.email)) {
            errorMessages.push({
                "message": "Некорректно указано email",
                "field": "email",
            })
        }
        let userWithCode = await usersService.findByLoginOrEmail("", req.body.email)
        if (errorMessages.length > 0) {
            res.status(400).send({errorsMessages: errorMessages})
        } else if (!userWithCode) {
            res.status(400).send({
                errorsMessages: [{
                    "message": "Юзера с таким email не существует",
                    "field": "email",
                }]
            })
        } else if (userWithCode.emailConfirmation.isConfirmed) {
            res.status(400).send({
                errorsMessages: [{
                    "message": "Юзер с таким email уже подтвержден",
                    "field": "email",
                }]
            })
        } else {
            let hArr = arr.filter((item: any) => item.date > Date.now() - 10 * 1000)
            if (hArr.length > 4) {
                res.send(429)
            } else {
                arr.push({
                    ip: req.ip,
                    date: Date.now()
                })
                let newCode = v4()
                await usersService.setNewConfirmationCode(userWithCode.id, newCode)
                await emailAdapter.emailSend(userWithCode.accountData.email, "Регистрация", `http://localhost:5000/auth/registration-confirmation?code=${newCode}`)
                res.send(204)
            }
        }
    })
