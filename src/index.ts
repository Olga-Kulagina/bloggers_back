import express, {Request, Response} from 'express'
import cors from 'cors'
import {bloggersRouter} from "./routes/bloggersRouter";
import {postsRouter} from "./routes/postsRouter";
import {authBasicMiddleware} from "./middlewares/authBasicMiddleware";
import {runDb} from "./repositories/db";
import {usersRouter} from "./routes/usersRouter";
import {authRouter} from "./routes/authRouter";

const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.use('/bloggers', bloggersRouter)
app.use('/posts', postsRouter)
app.use('/users', usersRouter)
app.use('/auth', authRouter)

export const error = (errorMessages: Array<{ field: string, message: string }>) => {
    return {
        "errorsMessages": errorMessages,
        "resultCode": 1
    }
}

const startApp = async () => {
    await runDb()
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}

startApp()