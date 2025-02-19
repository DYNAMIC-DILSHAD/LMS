import {Response} from "express";
import CourseModel from "../models/course.model";
import { asyncHandler } from "../utils/asyncHandler";

// create course
export const createCourse = asyncHandler(async(data:any, res:Response)=>{
    const course = await CourseModel.create(data);
    res.status(201).json({
        success:true,
        course
    })
})
