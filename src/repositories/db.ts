import {MongoClient} from 'mongodb'
import {BloggerType} from "./bloggersRepository";
import {PostType} from "./postsRepository";
import {settings} from "../settings";
import {UserDBType} from "./types";
import {CommentType} from "./commentsRepository";
import {RequestItemType} from "./requestCountRepository";
import {requestCountService} from "../domain/requestCountService";
import {usersService} from "../domain/usersService";

export const client = new MongoClient(settings.MONGO_URI)
export const db = client.db("youtube")
export const bloggersCollection = db.collection<BloggerType>("bloggers")
export const postsCollection = db.collection<PostType>("posts")
export const usersCollection = db.collection<UserDBType>("users")
export const commentsCollection = db.collection<CommentType>("comments")
export const requestCountCollection = db.collection<RequestItemType>("requestCount")

export async function runDb() {
    try {
        await client.connect();
        await client.db("bloggers").command({ ping: 1 });
        console.log("Connected successfully to mongo server");

    } catch {
        console.log("Can't connect to db");
        await client.close();
    }
}