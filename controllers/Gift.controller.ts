import Gift from "../models/Gifts.model.js";
import { Request, Response, NextFunction } from "express";
import errorResponse from "../utils/errorResponse.js";
import { checkUserById } from "../services/User.services.js";
import UserModel from "../models/User.model.js";

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
      user: user._id,
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

export const sendGift = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      body: { receiverId, amount },
    } = req;

    const { userId } = req;

    if (!receiverId) return next(errorResponse("receiver missing", 400));
    if (!amount) return next(errorResponse("amount missing", 400));
    let receiver = await checkUserById(receiverId);
    if (!receiver) return next(errorResponse("receiver not found", 404));

    let user = await checkUserById(userId);
    if (!user) return next(errorResponse("user not found", 404));

    let userGifts = await Gift.find({ user: user._id });
    if (!userGifts.length)
      return next(
        errorResponse("user has insufficient gifts. Please buy more", 403)
      );

    let newGifts = await new Gift({
      amount,
      user: receiver._id,
    }).save();

    if (newGifts._id) {
      await Gift.findOneAndDelete(userId);
      return;
    }
    throw new Error("unable to send gift");
  } catch (error: any) {
    console.log("[error-sending-gifts]", error.message);
    next(errorResponse("something went wrong"));
  }
};
