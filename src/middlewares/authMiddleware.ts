import {Request, Response, NextFunction} from "express";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (req.method === 'GET') {
        next()
    }
    if (req.headers.authorization === 'Basic YWRtaW46cXdlcnR5') {
        next()
    } else {
        res.send(401)
    }
}