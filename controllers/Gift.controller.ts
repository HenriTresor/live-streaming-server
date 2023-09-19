import Gift from "../models/Gifts.model.js";
import { Request, Response, NextFunction } from "express";
import errorResponse from "../utils/errorResponse.js";
import { checkUserById } from "../services/User.services.js";

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

    if (!amount)
      return next(errorResponse("amount is required to buy gift", 400));

    const user = await checkUserById(userId);
    if (!user) return next(errorResponse("user was not found", 404));

    if (user.coins <= 0)
      return next(
        errorResponse("user has insufficient coins. Please recharge", 403)
      );

    const newGift = await new Gift({
      amount,
      priceInCoins: Number(amount) === 1 ? 1 : 0,
    }).save();

    if (newGift._id) {
      user.coins--;
      await user.save();
      res.status(201).json({
        status: true,
        message: "your gift was added successfully",
      });

      return;
    }
    throw new Error("unable to buy gift");
  } catch (error: any) {
    console.log("[error-adding-gifts]", error.message);
    next(errorResponse("something went wrong"));
  }
};
