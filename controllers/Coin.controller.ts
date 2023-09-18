import { NextFunction, Request, Response } from "express";
import Coin from "../models/Coins.model.js";
import errorResponse from "../utils/errorResponse.js";

export const createCoin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      body: { price, amount },
    } = req;

    if (!price || !amount)
      return next(errorResponse("amount and price are required", 400));

    let newCoin = await new Coin({
      amount: amount,
      price: price,
    }).save();

    res.status(201).json({
      status: true,
      message: "new coin was successfully saved",
    });
  } catch (error: any) {
    console.log("[error-creating-coin]", error.message);
    next(errorResponse("something went wrong"));
  }
};
