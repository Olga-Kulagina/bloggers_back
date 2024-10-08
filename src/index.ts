import express from 'express'
import cors from 'cors'
import {bloggersRouter} from "./routes/bloggersRouter";
import {postsRouter} from "./routes/postsRouter";
import {runDb} from "./repositories/db";
import {usersRouter} from "./routes/usersRouter";
import {authRouter} from "./routes/authRouter";
import {commentsRouter} from "./routes/commentsRouter";
import {testingRouter} from "./routes/testingRouter";
import {emailRouter} from "./routes/emailRouter";
import cookieParser from 'cookie-parser';

const app = express()
const port = process.env.PORT || 5000

app.set('trust proxy', true)

app.use(cors())
app.use(express.json())
app.use(cookieParser());

app.use('/auth', authRouter)
app.use('/blogs', bloggersRouter)
app.use('/posts', postsRouter)
app.use('/users', usersRouter)
app.use('/comments', commentsRouter)
app.use('/testing', testingRouter)
app.use('/email', emailRouter)

export const error = (errorMessages: Array<{ field: string, message: string }>) => {
    return {
        errorsMessages: errorMessages
    }
}

const startApp = async () => {
    await runDb()
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}

startApp()