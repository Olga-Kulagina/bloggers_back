import {Request, Response, Router} from "express";
import {commentsService} from "../domain/commentsService";
import {authBasicMiddleware} from "../middlewares/authBasicMiddleware";
import {postsService} from "../domain/postsService";
import {bloggersService} from "../domain/bloggersService";
import {error} from "../index";
import {postsRouter} from "./postsRouter";
import {authBearerMiddleware} from "../middlewares/authBearerMiddleware";


export const commentsRouter = Router({})

commentsRouter.get('/:commentId', async (req: Request, res: Response) => {
    let foundComment = await commentsService.findCommentById(req.params.commentId)
    if (foundComment) {
        res.send(foundComment)
    } else {
        res.send(404)
    }
})

commentsRouter.put('/:commentId', authBearerMiddleware, async (req: Request, res: Response) => {
    let errorMessages = []
    const id = req.params.commentId
    const isCommentExist = await commentsService.findCommentById(id)
    if (!isCommentExist) {
        res.send(404)
    } else {
        if (!req.body.content || !req.body.content.trim() || req.body.content.length > 300 || req.body.content.length < 20) {
            errorMessages.push({
                "message": "Некорректно указано content",
                "field": "content",
            })
        }
        if (errorMessages.length > 0) {
            res.status(404).send(error(errorMessages))
        } else {
            let result = await commentsService.updateComment(id, req.body.content)
            res.send(204)
        }
    }
})
commentsRouter.delete('/:commentId', authBearerMiddleware, async (req: Request, res: Response) => {
    const id = req.params.commentId
    const isCommentExist = await commentsService.findCommentById(id)
    if (isCommentExist) {
        const result = await commentsService.deleteComment(id)
        res.send(204)
    } else {
        res.send(404)
    }
})
commentsRouter.delete('/', authBearerMiddleware, async (req: Request, res: Response) => {
    const result = await commentsService.deleteAllComments()
    res.send(204)
})