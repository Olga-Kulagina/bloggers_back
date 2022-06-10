import {Request, Response, Router} from "express";
import {emailAdapter} from "../adapters/emailAdapter";

export const emailRouter = Router({})

emailRouter.post('/send',
    async (req: Request, res: Response) => {
    await emailAdapter.emailSend(req.body.email, req.body.subject, req.body.message)
    })

