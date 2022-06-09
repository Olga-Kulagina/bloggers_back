import {Request, Response, Router} from "express";
import {testingService} from "../domain/testingService";

export const testingRouter = Router({})

testingRouter.delete('/all-data', async (req: Request, res: Response) => {
    const result = await testingService.deleteAllData()
    res.send(204)
})