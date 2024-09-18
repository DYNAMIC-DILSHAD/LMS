import dotenv from "dotenv";
dotenv.config()
import express, { NextFunction,Response,Request } from "express";
import cors from "cors"
import cookieParser from "cookie-parser";
import { ErrorMiddleware } from "./middleware/error";

export const app = express()
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))
app.use(express.json({limit:"50mb"}))
app.use(cookieParser())

// api testing

app.get("/test",(req:Request, res:Response,next:NextFunction) => {
    res.status(200).json({
        success:true,
        message:"Api is working"
    })
})

app.all("*",(req:Request, res:Response,next:NextFunction) => {
    const err = new Error(`Route ${req.originalUrl} not found`) as any
    err.status = 404
    next(err)
  
})

app.use(ErrorMiddleware)

