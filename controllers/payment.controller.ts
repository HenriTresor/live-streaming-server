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

    if (!items?.length) return next(errorResponse("coins to buy are required"));
    const coins = await getCoins();

    const line_items = req.body.items?.flatMap((item: any) => {
      const coinItem = coins?.find(
        (coin) => Number(coin.amount) === Number(item.amount)
      );

      if (!coinItem) {
        throw new Error(`Coin item not found for amount: ${item.amount}`);
      }

      const lineItem = {
        price_data: {
          currency: "usd",
          product_data: {
            name: coinItem.amount,
          },
          unit_amount_decimal: (coinItem.price * 100).toFixed(2), // Set unit_amount_decimal based on coinItem's price in cents
        },
        quantity: 1, // Each item has a quantity of 1
      };

      // Create an array with repeated line items based on quantity
      return Array.from({ length: 1 }, () => lineItem);
    });
    console.log("line items", line_items);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["paypal", "card"],
      mode: "payment",
      line_items: line_items,
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
      console.log("coins were not added");
    }
  } catch (error: any) {
    console.log("error-creating-checkout-session", error.message);
    next(errorResponse("something went wrong"));
  }
};
