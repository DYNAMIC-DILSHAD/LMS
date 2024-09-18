import mongoose,{Document,Model,Schema} from "mongoose";
import bcrypt from 'bcryptjs'


const emailRegexPattern = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/;

// here we are making Interfce
export interface IUser extends Document {
    name:string;
    email:string;
    password:string;
    avatar: {
        public_id:string;
        url:string;
    },
    role:string;
    isVerified:boolean;
    courses:Array<{courseId:string}>;
    isPasswordCorrect:(password:string) => Promise<boolean>
}

// user schema

const userSchema:Schema<IUser> = new mongoose.Schema({
    name:{
        type:String,
        required:[true, "Please enter your name"]
    },
    email:{
        type:String,
        required:[true, "Please enter your email"],
        validate:{                                       // it's unique for me to validate email through rmailRegex
            validator : function (value:string) {
                return emailRegexPattern.test(value)
            },
            message:"Please enter your valid email"
        },
        unique:true
    },
    password:{
        type:String,
        required:true,
        minlength:[6, "Password must be at least 6 characters"],
        select:false
    },
    avatar:{
        public_id:String,
        url:String
    },
    role:{
        type:String,
        default:"user"
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    courses:[{
        courseId:String
    }]
})
