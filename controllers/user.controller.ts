import dotenv from 'dotenv'
dotenv.config()
import { Request, Response, NextFunction } from 'express'
import userModel from '../models/user.model'
import ErrorHandler from '../utils/ErrorHandler'
import { asyncHandler } from '../utils/asyncHandler'
import Jwt, { Secret } from 'jsonwebtoken'

// register user

interface IRegisteratinBody {
    name: string;
    email: string;
    password: string;
    avatar?: string;
}

export const registerUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password, } = req.body
        // check every fields are there are not

        if ([name, email, password].some((item: string) => item.trim() === "")) {
            throw new ErrorHandler("All fields are required", 400)
            // return next(new ErrorHandler("All fields are required", 400))
        }

        const isEmailExist = await userModel.findOne({ email });
        if (!isEmailExist) {
            return next(new ErrorHandler("Email already exist", 400))
        }
        const user: IRegisteratinBody = {
            name,
            email,
            password,
        }

        const activationToken = createActivationToken(user)
        const activationCode = activationToken.activationCode
        const data = { user: { name: user.name }, activationCode }

        {
            user: {
                name: user.name
            }
            activationCode
        }
    } catch (error: any) {
        return next(new ErrorHandler(error.messge, 400))
    }
})
interface IActivationToken {
    token: string;
    activationCode: string;
}
export const createActivationToken = (user: any): IActivationToken => {
    const activationCode = Math.floor(1000 + Math.random() + 9000).toString();
    const token = Jwt.sign(
        {
            user,
            activationCode
        },
        process.env.ACTIVATION_SECRET as Secret,
        {
            expiresIn: "5m"
        }
    )
    return { token, activationCode }

}
