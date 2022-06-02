import {Request, Response, NextFunction} from "express";

export const authBasicMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (req.method === 'GET' || req.headers.authorization === 'Basic YWRtaW46cXdlcnR5') {
        next()
    } else {
        res.send(401)
    }
}