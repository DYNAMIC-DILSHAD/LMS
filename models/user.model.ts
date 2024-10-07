import dotenv from "dotenv";
dotenv.config();
import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { NextFunction } from "express";
import Jwt from "jsonwebtoken";

const emailRegexPattern =
  /^[a-zA-Z0-9]+@[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/;

// here we are making Interfce
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar: {
    public_id: string;
    url: string;
  };
  role: string;
  isVerified: boolean;
  courses: Array<{ courseId: string }>;
  isPasswordCorrect: (password: string) => Promise<boolean>;
  signAccessToken : () => {};
  signRefreshToken : () => {};
}

// user schema

const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      validate: {
        // it's unique for me to validate email through rmailRegex
        validator: function (value: string) {
          return emailRegexPattern.test(value);
        },
        message: "Please enter your valid email",
      },
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    avatar: {
      public_id: String,
      url: String,
    },
    role: {
      type: String,
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    courses: [
      {
        courseId: String,
      },
    ],
  },
  { timestamps: true }
);

// Hash password
userSchema.pre("save", async function (next) {
  const user = this as IUser; // Explicitly cast `this` to `IUser`

  if (!user.isModified("password")) {
    return next();
  }

  user.password = await bcrypt.hash(user.password, 10);
  next();
});

// here save is throwing some typescript error
// userSchema.pre<IUser>('save', async function (next: NextFunction) {
//     if (!this.isModified("password")) {
//         return next()
//     }
//     this.password = await bcrypt.hash(this.password, 10)
//     next()
// })

userSchema.methods.isPasswordCorrect = async function (
  password: string
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};
userSchema.methods.signAccessToken = function () {
  return Jwt.sign(
    {
      id: this._id,
    },
    process.env.ACCESS_TOKEN || ""
  );
};

userSchema.methods.signRefreshToken = function () {  
  return Jwt.sign(
    {
      id: this._id,
    },
    process.env.REFRESH_TOKEN || ""
  );
};
const userModel: Model<IUser> = mongoose.model("User", userSchema);

export default userModel;
