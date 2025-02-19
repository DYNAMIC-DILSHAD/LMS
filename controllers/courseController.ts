import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import ErrorHandler from "../utils/ErrorHandler";
import cloudinary from "cloudinary"

// upload course