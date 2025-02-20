import { NextFunction,Request,Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import ErrorHandler from "../utils/ErrorHandler";
import OrderModel, { IOrder } from "../models/order.Model";
import userModel from "../models/user.model";
import CourseModel from "../models/course.model";
import path from "path";
import ejs from "ejs";
import sendMail from "../utils/sendMails";
import NotificationModel from "../models/notification.Model";

// Create Order

export const createOrder = asyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const {courseId, payment_info} = req.body as IOrder;
        const userId = req.user?._id
        const user = await userModel.findById(userId)
        
        

    } catch (error:any) {
        return next(new ErrorHandler(error.meassage,500))
    }
})

