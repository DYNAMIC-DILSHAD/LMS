import { NextFunction, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import OrderModel from "../models/order.Model";

// create new Order
export const newOrder = asyncHandler(async(data:any,res:Response, next:NextFunction,)=>{
    const order = await OrderModel.create(data);
    res.status(201).json({
        success: true,
        order
      });
    
})

// Get all Order
export const getAllOrderService = async(res:Response)=>{
  const orders = await OrderModel.find().sort({createdAt:-1});
  res.status(201).json({
    success:true,
    orders
  })
}