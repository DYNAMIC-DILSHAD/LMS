import dotenv from 'dotenv'
dotenv.config()
import { Request, Response, NextFunction } from 'express'
import userModel from '../models/user.model'
import ErrorHandler from '../utils/ErrorHandler'
import { asyncHandler } from '../utils/asyncHandler'
import Jwt, { Secret } from 'jsonwebtoken'
import ejs from 'ejs'
import path from 'path'
import sendMail from '../utils/sendMails'
import { IUser } from '../models/user.model'

// register user

interface IRegisteratinBody {
    name: string;
    email: string;
    password: string;
    avatar?: string;
}

export const registerUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    // try {
    const { name, email, password, } = req.body
    // check every fields are there are not

    if ([name, email, password].some((field: string) => field?.trim() === "")) {
        return new ErrorHandler("All fields are required", 400)
        // return next(new ErrorHandler("All fields are required", 400))
    }

    const isEmailExist = await userModel.findOne({ email });
    if (isEmailExist) {
        return next(new ErrorHandler("Email already exist", 400))
    }
    const user: IRegisteratinBody = {
        name,
        email,
        password,
    }

    const activationToken = createActivationToken(user)
    const activationCode = activationToken.activationCode  // 6 digitd number for varify user through email
    const data = { user: { name: user.name }, activationCode }

    // const html = await ejs.renderFile(path.join(__dirname, "../mails/activation-mail.ejs"), data)
    // console.log(html)
    try {
        await sendMail({
            email: user.email,
            subject: "Activate your account",
            template: "Activation-mail.ejs",
            data
        })

        res.status(201).json({
            success: true,
            message: `Please check your email ${user.email} to activate ypur account`,
            activationToken: activationToken.token
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.messge, 400))
    }
    // } catch (error: any) {
    //     return next(new ErrorHandler("In parrent we got error", 400))
    // }
})
interface IActivationToken {
    token: string;
    activationCode: string;
}
export const createActivationToken = (user: any): IActivationToken => {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
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
    // console.log("token generated by jwt :-  ",token)
    return { token, activationCode }

}

// activate user
interface IActivationUser {
    activation_token: string;
    activation_code: string;
}

export const activateUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { activation_token, activation_code } = req.body as IActivationUser
        const newUser: { user: IUser; activationCode: string } = Jwt.verify(
            activation_token,
            process.env.ACTIVATION_SECRET as string,
        ) as { user: IUser; activationCode: string }

        if (newUser.activationCode !== activation_code) {
            return next(new ErrorHandler("Invalid activation code", 400))
        }

        const { name, email, password } = newUser.user
        const existUser = await userModel.findOne({ email })
        if (existUser) {
            return next(new ErrorHandler("Email already exist", 400))
        }

        const user = await userModel.create({
            name, email, password
        })

        res.status(201).json({
            success: true,
        })

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400))
    }
})

