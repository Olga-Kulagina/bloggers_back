import {NextFunction, Request, Response} from "express";
import {jwtUtility} from "../application/jwt-utility";
import {usersService} from "../domain/usersService";

export const authBearerMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        res.send(401)
        return
    }
    const token = req.headers.authorization.split(' ')[1]
    const userId = await jwtUtility.extractUserIdFromToken(token)
    if (userId) {
        req.user = await usersService.findUserById(userId)
        next()
        return
    }
    res.send(401)
}