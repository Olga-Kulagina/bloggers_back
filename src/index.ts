import express, {Request, Response} from 'express'
import cors from 'cors'

const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

let bloggers = [
    {id: 1, name: 'IT-KAMASUTRA', youtubeUrl: 'https://www.youtube.com/channel/UCTW0FUhT0m-Bqg2trTbSs0g'},
    {id: 2, name: 'Egor Malkevich', youtubeUrl: 'https://www.youtube.com/channel/UCOoZWIvTu-onaFbm0YUyY0A'},
    {id: 3, name: 'Ulbi TV', youtubeUrl: 'https://www.youtube.com/channel/UCDzGdB9TTgFm8jRXn1tBdoA'},
    {id: 4, name: 'АйТиБорода', youtubeUrl: 'https://www.youtube.com/c/ITBEARD'},
    {id: 5, name: 'Артемий Лебедев', youtubeUrl: 'https://www.youtube.com/user/temalebedev'},
]

let posts = [
    {
        id: 1,
        title: "01 - Введение / Back-end - Путь Самурая",
        shortDescription: "Back-end Путь Самурая",
        content: "https://www.youtube.com/watch?v=cHVhpNrjcPs",
        bloggerId: 1,
        bloggerName: "IT-KAMASUTRA"
    },
    {
        id: 2,
        title: "02 - front-end vs back-end, что выбрать / Back-end - Путь Самурая",
        shortDescription: "Back-end Путь Самурая",
        content: "https://www.youtube.com/watch?v=ugfE0ttbstQ",
        bloggerId: 1,
        bloggerName: "IT-KAMASUTRA"
    },
    {
        id: 3,
        title: "Поговорим за жизнь",
        shortDescription: "Кругом проблемы: семья, отношения, начальник дурак, работник козел...",
        content: "https://www.youtube.com/watch?v=DSl2Mkcynys&t=12090s",
        bloggerId: 2,
        bloggerName: "Egor Malkevich"
    },
    {
        id: 4,
        title: "НОВЫЙ REACT 18 ВЫШЕЛ",
        shortDescription: "В этом ролике мы посмотрим новые фичи React 18",
        content: "https://www.youtube.com/watch?v=qdCGwwSefX8&t=881s",
        bloggerId: 3,
        bloggerName: "Ulbi TV"
    },
    {
        id: 5,
        title: "Грибы научились разговаривать / Найдены штаны 3000-летней давности / Дровосеки отжали лося у медведя",
        shortDescription: "Самые честные новости",
        content: "https://www.youtube.com/watch?v=H-C3ECu8b14",
        bloggerId: 5,
        bloggerName: "Артемий Лебедев"
    },
]

const error = (errorMessages: Array<{ field: string, message: string }>) => {
    return {
        "errorsMessages": errorMessages,
        "resultCode": 1
    }
}

app.get('/', (req: Request, res: Response) => {
    res.send(bloggers)
})

app.get('/bloggers', (req: Request, res: Response) => {
    res.send(bloggers)
})
app.get('/bloggers/:bloggerId', (req: Request, res: Response) => {
    const id = +req.params.bloggerId
    const isBloggerExist = bloggers.findIndex(b => b.id === id) !== -1
    if (isBloggerExist) {
        const blogger = bloggers.find(b => b.id === id)
        res.send(blogger)
    } else {
        res.send(404)
    }
})
app.post('/bloggers', (req: Request, res: Response) => {
    let errorMessages = []
    if (!req.body.name || !req.body.name.trim() || req.body.name.length > 15) {
        errorMessages.push({
            "message": "Некорректно указано name",
            "field": "name",
        })
    }
    let regexp = /https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?/
    if (!req.body.youtubeUrl || !regexp.test(req.body.youtubeUrl) || req.body.youtubeUrl.length > 100) {
        errorMessages.push({
            "message": "Некорректно указано youtubeUrl",
            "field": "youtubeUrl",
        })
    }
    if (errorMessages.length > 0) {
        res.status(400).send(error(errorMessages))
    }
    const newBlogger = {
        id: +(new Date()),
        name: req.body.name,
        youtubeUrl: req.body.youtubeUrl,
    }
    bloggers.push(newBlogger)
    res.status(201).send(newBlogger)
})
app.put('/bloggers/:bloggerId', (req: Request, res: Response) => {
    let errorMessages = []
    const id = +req.params.bloggerId
    const isBloggerExist = bloggers.findIndex(b => b.id === id) !== -1
    if (!isBloggerExist) {
        res.send(404)
    }
    if (!req.body.name || !req.body.name.trim() || req.body.name.length > 15) {
        errorMessages.push({
            "message": "Некорректно указано name",
            "field": "name",
        })
    }
    let regexp = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/
    if (!req.body.youtubeUrl || !regexp.test(req.body.youtubeUrl)  || req.body.youtubeUrl.length > 100) {
        errorMessages.push({
            "message": "Некорректно указано youtubeUrl",
            "field": "youtubeUrl",
        })
    }
    if (errorMessages.length > 0) {
        res.status(400).send(error(errorMessages))
    }
    bloggers = bloggers.map(b => b.id === id ? {...b, name: req.body.name, youtubeUrl: req.body.youtubeUrl} : b)
    res.send(204)
})
app.delete('/bloggers/:bloggerId', (req: Request, res: Response) => {
    const id = +req.params.bloggerId
    const isBloggerExist = bloggers.findIndex(b => b.id === id) !== -1
    if (isBloggerExist) {
        const index = bloggers.findIndex(b => b.id === id)
        bloggers.splice(index, 1)
        res.send(204)
    } else {
        res.send(404)
    }
})

app.get('/posts', (req: Request, res: Response) => {
    res.send(posts)
})
app.get('/posts/:postId', (req: Request, res: Response) => {
    const id = +req.params.postId
    const isPostExist = posts.findIndex(p => p.id === id) !== -1
    if (isPostExist) {
        const post = posts.find(p => p.id === id)
        res.send(post)
    } else {
        res.send(404)
    }
})
app.post('/posts', (req: Request, res: Response) => {
    let errorMessages = []
    const id = +req.body.bloggerId
    const bloggerIndex = bloggers.findIndex(b => b.id === id)
    const isBloggerExist = bloggerIndex !== -1
    if (!isBloggerExist) {
        res.send(404)
    }
    if (!req.body.title || !req.body.title.trim() || req.body.title.length > 30) {
        errorMessages.push({
            "message": "Некорректно указано title",
            "field": "title",
        })
    }
    if (!req.body.shortDescription || !req.body.shortDescription.trim() || req.body.shortDescription.length > 100) {
        errorMessages.push({
            "message": "Некорректно указано shortDescription",
            "field": "shortDescription",
        })
    }
    if (!req.body.content || !req.body.content.trim() || req.body.content.length > 1000) {
        errorMessages.push({
            "message": "Некорректно указано content",
            "field": "content",
        })
    }
    if (errorMessages.length > 0) {
        res.status(400).send(error(errorMessages))
    }
    const newPost = {
        id: +(new Date()),
        title: req.body.title,
        shortDescription: req.body.shortDescription,
        content: req.body.content,
        bloggerId: +req.body.bloggerId,
        bloggerName: bloggers[bloggerIndex].name,
    }
    posts.push(newPost)
    res.status(201).send(newPost)
})
app.put('/posts/:postId', (req: Request, res: Response) => {
    let errorMessages = []
    const id = +req.params.postId
    const isPostExist = posts.findIndex(p => p.id === id) !== -1
    if (!isPostExist) {
        res.send(404)
    }
    const bloggerIndex = bloggers.findIndex(b => b.id === +req.body.bloggerId)
    const isBloggerExist = bloggerIndex !== -1
    if (!isBloggerExist) {
        res.send(404)
    }
    if (!req.body.title || !req.body.title.trim() || req.body.title.length > 30) {
         errorMessages.push({
            "message": "Некорректно указано title",
            "field": "title",
        })
    }
    if (!req.body.shortDescription || !req.body.shortDescription.trim() || req.body.shortDescription.length > 100) {
        errorMessages.push({
            "message": "Некорректно указано shortDescription",
            "field": "shortDescription",
        })
    }
    if (!req.body.content || !req.body.content.trim() || req.body.content.length > 1000) {
        errorMessages.push({
            "message": "Некорректно указано content",
            "field": "content",
        })
    }
    if (errorMessages.length > 0) {
        res.status(400).send(error(errorMessages))
    }
    posts = posts.map(p => p.id === id ? {
        ...p,
        title: req.body.title,
        shortDescription: req.body.shortDescription,
        content: req.body.content,
        bloggerId: req.body.bloggerId,
        bloggerName: bloggers[bloggerIndex].name,
    } : p)
    res.send(204)
})
app.delete('/posts/:postId', (req: Request, res: Response) => {
    const id = +req.params.postId
    const isPostExist = posts.findIndex(p => p.id === id) !== -1
    if (isPostExist) {
        const index = posts.findIndex(p => p.id === id)
        posts.splice(index, 1)
        res.send(204)
    } else {
        res.send(404)
    }
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})