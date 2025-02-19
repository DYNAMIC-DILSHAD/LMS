import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import ErrorHandler from "../utils/ErrorHandler";
import cloudinary from "cloudinary";
import { createCourse } from "../services/course.service";
import CourseModel from "../models/course.model";
import { redis } from "../utils/redis";

// upload course
export const uploadCourse = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      // console.log(data)
      const thumbnail = data.thumbnail;
      // console.log("thumbnail", thumbnail)
      if (thumbnail) {
        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "courses",
        });
        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }
      createCourse(data, res, next);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// edit course
export const editCourse = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const thumbnail = data.thumbnail;
      if (thumbnail) {
        await cloudinary.v2.uploader.destroy(thumbnail.public_id);
        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "courses",
        });
        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }

      const courseId = req.params.id;
      const course = await CourseModel.findByIdAndUpdate(
        courseId,
        { $set: data },
        { new: true }
      );
      res.status(201).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Get single course --> without purchasing
export const getSingleCourse = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courseId = req.params.id;
      const isChacheExist = await redis.get(courseId);
      if (isChacheExist) {
        // console.log("hitting redis")
        const course = JSON.parse(isChacheExist);
        res.status(200).json({
          success: true,
          course,
        });
      } else {
        const course = await CourseModel.findById(req.params.id).select({
          "courseData.videoUrl": 0,
          "courseData.suggestion": 0,
          "courseData.questions": 0,
          "courseData.links": 0,
        });
        await redis.set(courseId, JSON.stringify(course));
        // console.log("hitting mongodb")

        res.status(200).json({
          success: true,
          course,
        });
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Get all courses --> without purchasing
export const getAllCourses = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const isChacheExist = await redis.get("allCourses");
      if (isChacheExist) {
        const courses = JSON.parse(isChacheExist);
        // console.log("hitting redis");
        res.status(200).json({
          success: true,
          courses,
        });
      } else {
        const courses = await CourseModel.find().select({
          "courseData.videoUrl": 0,
          "courseData.suggestion": 0,
          "courseData.questions": 0,
          "courseData.links": 0,
        });
        // console.log("hitting mongodb");
        await redis.set("allCourses", JSON.stringify(courses));
        res.status(200).json({
          success: true,
          courses,
        });
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//Get Course Content --> Only For Valid Users

export const getCourseByUser = asyncHandler(async(req:Request, res:Response,next:NextFunction)=>{
    try {
        
    } catch (error:any) {
        return next(new ErrorHandler(error.message, 400))
        
    }
})
