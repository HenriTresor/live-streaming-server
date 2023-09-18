import { NextFunction, Request, Response } from "express";
import stripe from "../configs/stripe.config.js";
import errorResponse from "../utils/errorResponse.js";

export const createCheckoutSession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(req.body);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["paypal", "card"],
      mode: "payment",
      line_items: req.body.items?.map((item: any) => {
        return {
          price_data: {
            currency: "usd",
            unit_amount: 1000,
            product_data: {
              name: item.name,
            },
          },
          quantity: item.quantity,
        };
      }),
      success_url: `${process.env.SERVER_URL}/api/v1/stripe/success`,
    });

    res.status(200).json({
      status: true,
      url: session.url,
    });
  } catch (error: any) {
    console.log("error-creating-checkout-session", error.message);
    next(errorResponse("something went wrong"));
  }
};
