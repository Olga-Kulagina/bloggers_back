import {Request, Response, Router} from "express";
import {commentsService} from "../domain/commentsService";
import {error} from "../index";
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
    if (isCommentExist && req.user.id !== isCommentExist.userId) {
        res.send(403)
        return
    }
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
            res.status(400).send(error(errorMessages))
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
        if (req.user.id !== isCommentExist.userId) {
            res.send(403)
            return
        }
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