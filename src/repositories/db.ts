import {MongoClient} from 'mongodb'
import {BloggerType} from "./bloggersRepository";

const mongoUri = "mongodb+srv://Olga:kyWebWFJ8Q08IFkU@cluster0.hk713.mongodb.net";

export const client = new MongoClient(mongoUri)
const db = client.db("youtube")
export const bloggersCollection = db.collection<BloggerType>("bloggers")

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