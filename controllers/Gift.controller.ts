import Gift from "../models/Gifts.model.js";
import { Request, Response, NextFunction } from "express";
import errorResponse from "../utils/errorResponse.js";

export const buyGift = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      userId,
      body: { amount },
    } = req;

    if (!userId)
      return next(errorResponse("User id is required to buy gift", 400));

    const newGift = await new Gift({
      amount,
      priceInCoins: Number(amount) === 1 ? 1 : 0,
    }).save();

    res.status(201).json({
      status: true,
      message: "your gift was added successfully",
    });
  } catch (error: any) {
    console.log("[error-adding-gifts]", error.message);
    next(errorResponse("something went wrong"));
  }
};
