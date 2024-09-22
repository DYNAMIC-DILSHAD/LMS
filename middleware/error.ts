import { NextFunction, Response, Request } from "express";
import ErrorHandler from "../utils/ErrorHandler";

 export const ErrorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
    err.statusCode = err.statusCode || 500 // if err.statusCode exist then assign the value err.status otherwise 500
    err.message = err.message || "Internal server error"

    // wrong mongodb id error
    if (err.name === "CastError") {
        const message = `Resourse not found, Invalid, path ${err.path}`;
        err = new ErrorHandler(message, 400)
    }

    // Duplicate key error
    if (err.name === 1100) {
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`
        err = new ErrorHandler(message, 400)
    }

    // wrong jwt error
    if (err.name === 'JsonwebTokenError') {
        const message = `Json web token is invalid, try again`
        err = new ErrorHandler(message, 400)
    }

    //jwt expired token
    if (err.name === 'TokenExpiredError') {
        const message = `Json web token is expired, Try again`
        err = new ErrorHandler(message, 400);

    }
    res.status(err.statusCode).json({
        success: false,
        messgae: err.message
    })
}