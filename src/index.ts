import express, {Request, Response} from 'express'
import cors from 'cors'
import {bloggersRouter} from "./routes/bloggersRouter";
import {postsRouter} from "./routes/postsRouter";
import {authMiddleware} from "./middlewares/authMiddleware";

const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())
app.use(authMiddleware)

app.use('/bloggers', bloggersRouter)
app.use('/posts', postsRouter)

export const error = (errorMessages: Array<{ field: string, message: string }>) => {
    return {
        "errorsMessages": errorMessages,
        "resultCode": 1
    }
}

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})