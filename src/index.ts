import express from 'express'
import cors from 'cors'
import {bloggersRouter} from "./routes/bloggersRouter";
import {postsRouter} from "./routes/postsRouter";
import {runDb} from "./repositories/db";
import {usersRouter} from "./routes/usersRouter";
import {authRouter} from "./routes/authRouter";
import {commentsRouter} from "./routes/commentsRouter";
import {testingRouter} from "./routes/testingRouter";

const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.use('/auth', authRouter)
app.use('/bloggers', bloggersRouter)
app.use('/posts', postsRouter)
app.use('/users', usersRouter)
app.use('/comments', commentsRouter)
app.use('/testing', testingRouter)

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