import {bloggersCollection} from "./db";

export type BloggerType = {
    id: number
    name: string
    youtubeUrl: string
}

export const bloggersRepository = {
    async findBloggers(name: string | null | undefined): Promise<BloggerType[]> {
        const filter: any = {}
        if (name) {
            filter.name = {$regex: name}
        }
        return bloggersCollection.find(filter).toArray()
    },
    /*async findProductById(id: number): Promise<ProductType | null> {
        let product = await productsCollection.findOne({id: id})
        return product
    },
    async createProduct(newProduct: ProductType): Promise<ProductType> {
        const result = await productsCollection.insertOne(newProduct)
        return newProduct
    },
    async updateProduct(id: number, title: string): Promise<boolean> {
        const result = await productsCollection.updateOne({id: id}, {$set: {title: title}})

        return result.matchedCount === 1
    },
    async deleteProduct(id: number): Promise<boolean> {
        let result = await productsCollection.deleteOne({id: id})
        return result.deletedCount === 1
    }*/
}
