import {MongoClient} from 'mongodb'
import {BloggerType} from "./bloggersRepository";
import {PostType} from "./postsRepository";
import {UserType} from "./usersRepository";

const mongoUri = "mongodb+srv://Olga:kyWebWFJ8Q08IFkU@cluster0.hk713.mongodb.net";

export const client = new MongoClient(mongoUri)
export const db = client.db("youtube")
export const bloggersCollection = db.collection<BloggerType>("bloggers")
export const postsCollection = db.collection<PostType>("posts")
export const usersCollection = db.collection<UserType>("users")

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