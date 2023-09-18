import { NextFunction, Request, Response } from "express";
import stripe from "../configs/stripe.config.js";
import errorResponse from "../utils/errorResponse.js";
import { getCoins } from "../services/payment.js";
import UserModel from "../models/User.model.js";

export const createCheckoutSession = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      userId,
      body: { items },
    } = req;

    if (!items.length) return next(errorResponse("coins to buy are required"));
    const coins = await getCoins();
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["paypal", "card"],
      mode: "payment",
      line_items: req.body.items?.map((item: any) => {
        const coinItem = coins?.find(
          (coin) => Number(coin.price) === Number(item.price)
        );
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: coinItem?.amount,
            },
            unit_amount: coinItem?.price,
          },
          quantity: item.amount,
        };
      }),
      success_url: `${process.env.SERVER_URL}/api/v1/stripe/success`,
    });

    res.status(200).json({
      status: true,
      url: session.url,
    });
    if (session.payment_status === "paid") {
      await UserModel.findOneAndUpdate(
        userId,
        {
          $inc: {
            coins: req.items[0].amount,
          },
        },
        { new: true }
      );
      return;
    } else {
      throw new Error();
    }
  } catch (error: any) {
    console.log("error-creating-checkout-session", error.message);
    next(errorResponse("something went wrong"));
  }
};
