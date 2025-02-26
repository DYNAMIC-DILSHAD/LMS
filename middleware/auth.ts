import dotenv from 'dotenv'
dotenv.config()
import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import ErrorHandler from "../utils/ErrorHandler";
import jwt, { JwtPayload } from 'jsonwebtoken'
import { redis } from '../utils/redis';

// authenticated user

export const isAuthenticated = asyncHandler(async(req:Request, res:Response, next:NextFunction) =>{
    const access_token = await req.cookies.accessToken || req.headers.authorization?.split(' ')[1]; ;
   
    if(!access_token) {
        return next(new ErrorHandler("Please login to access the resourse", 400))
    }
    const decoded = jwt.verify(
        access_token,
        process.env.ACCESS_TOKEN as string
    ) as JwtPayload
  
    if(!decoded) {
        return next(new ErrorHandler("access token are not valid", 400))
    }
    // if (typeof decoded === 'string' || !('id' in decoded)) {
    //     return next(new ErrorHandler("Access token is not valid", 400));
    // }
  
    const user = await redis.get(decoded.id )
    

    if(!user) {
        return next(new ErrorHandler("Please login to access this resourses", 400))
    }
    req.user = JSON.parse(user)
    next()
})

// validate user role
export const authorizedRoles = (...roles : string[]) => {
    return (req:Request, res:Response, next:NextFunction) =>{
        if(!roles.includes(req.user?.role || "")) {
            return next(new ErrorHandler(`Role: ${req.user?.role} is not allowed to access this resourse`, 400))
        }
        next()
    }
}