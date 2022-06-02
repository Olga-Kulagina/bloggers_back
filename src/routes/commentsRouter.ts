import {Request, Response, Router} from "express";
import {error} from "../index";
import {bloggers} from "./bloggersRouter";
import {bloggersService} from "../domain/bloggersService";
import {postsService} from "../domain/postsService";
import {authBasicMiddleware} from "../middlewares/authBasicMiddleware";
import {authBearerMiddleware} from "../middlewares/authBearerMiddleware";
import {usersService} from "../domain/usersService";
import {commentsService} from "../domain/commentsService";


export const commentsRouter = Router({})

commentsRouter.get('/:commentId', async (req: Request, res: Response) => {
    let foundComment = await commentsService.findCommentByPostId(req.params.postId)
    if (foundComment) {
        res.send(foundComment)
    } else {
        res.send(404)
    }
})

