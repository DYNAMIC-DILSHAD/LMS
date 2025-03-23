const { createRazorpayInstance } = require("../config/razorpay.config");
import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import ErrorHandler from "../utils/ErrorHandler";
import OrderModel, { IOrder } from "../models/order.Model";
import userModel from "../models/user.model";
import CourseModel from "../models/course.model";
import path from "path";
import ejs from "ejs";
import sendMail from "../utils/sendMails";
import NotificationModel from "../models/notification.Model";
import { getAllOrderService, newOrder } from "../services/order.service";
import { redis } from "../utils/redis";
require("dotenv").config();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);



export const createOrder = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId, payment_info } = req.body as IOrder;

      if (payment_info) {
        if ("id" in payment_info) {
          const paymentIntentId = payment_info.id;
          const paymentIntent = await stripe.paymentIntents.retrieve(
            // we are validaing, scammers , sending dummy things that are not actually payment information
            paymentIntentId
          );

          if (paymentIntent.status !== "succeeded") {
            return next(new ErrorHandler("Payment not authorized", 400));
          }
        }
      }

      const user = await userModel.findById(req.user?._id);
      const courseExistInUser = user?.courses.some(
        (course: any) => course._id.toString() === courseId
      );
      if (courseExistInUser) {
        return next(
          new ErrorHandler("You have already purchased this course", 400)
        );
      }
      const course: any = await CourseModel.findById(courseId);

      if (!course) {
        return next(new ErrorHandler("Course not found", 400));
      }
      const data: any = {
        courseId: course._id,
        userId: user?._id,
        payment_info,
      };

      const mailData = {
        order: {
          _id: course._id.toString().slice(0, 6),
          name: course.name,
          price: course.price,
          date: new Date().toLocaleDateString("en-us", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        },
      };
      const html = await ejs.renderFile(
        path.join(__dirname, "../mails/order-confirmation.ejs"),
        { order: mailData }
      );

      try {
        if (user) {
          await sendMail({
            email: user.email,
            subject: "Order-confirmation",
            template: "Order-confirmation.ejs",
            data: mailData,
          });
        }
      } catch (error: any) {
        return next(new ErrorHandler(error.meassage, 500));
      }
      // console.log("email sent")
      // console.log("course._id =>", course._id)
      // console.log("user =>", user)
      // console.log("courses =>", user?.courses)
      const userId = req.user?._id as any;

      user?.courses.push(course?._id);
      await redis.set(userId, JSON.stringify(user));
      await user?.save();
      console.log(user?.courses);

      await NotificationModel.create({
        user: user?._id,
        title: "New Order",
        message: `You have a new order from ${course?.name}`,
      });

      // course.purchased += course.purchased
      course.purchased = (course.purchased || 0) + 1;
      await course.save();

      console.log(course.purchased);
      await course.save();

      newOrder(data, res, next);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Get All Orders ---> Only for Admin
export const getAllOrders = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllOrderService(res);
    } catch (error: any) {
      return next(new ErrorHandler(error.mexxage, 400));
    }
  }
);

// send stripe publishble key
export const sendStripePublishableKey = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("it is a backend side", process.env.STRIPE_PUBLISHABLE_KEY);
    res.status(200).json({
      publishablekey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
  }
);

// New payment
export const newPayment = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const myPayentt = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: "USD",
        metadata: {
          company: "E-Learning",
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });
      console.log(myPayentt.client_secret);

      res.status(201).json({
        success: true,
        client_secret: myPayentt.client_secret,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const newPayment = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const options = {
        amount: req.body.amount,
        currency: "INR",
        receipt: `receipt_order_1`,
      };

      createRazorpayInstance.orders.create(options, (err: any, order: any) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: "Something went wrong",
          });
        }

        return res.status(200).json({
          success: true,
          order,
        });
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
