import express, { Router } from "express";
import errorResponse from "../utils/errorResponse.js";
import stripe from "../configs/stripe.config.js";
import { createCheckoutSession } from "../controllers/payment.controller.js";
import verifyToken from "../middlewares/verifyToken.js";
import { config } from "dotenv";
import UserModel from "../models/User.model.js";

config();

const router = Router();

router.post("/create-checkout-session", createCheckoutSession);

router.get("/success", (req, res) => {
  res.send("success");
});

router.post(
  "/webhook/payment-success",
  express.raw({ type: "application/json" }),
  async (req: any, res, next) => {
    try {
      const sig: any = req.headers["stripe-signature"];
      let e;

      e = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET as string
      );

      if (e.type === "checkout.session.completed") {
        const amount: any = e.data.object as number;
        console.log(amount);
      }
    } catch (error) {
      console.log("error-payment-success", error);
      next(errorResponse("something went wrong"));
    }
  }
);

export default router;
