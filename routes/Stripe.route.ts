import { Router } from "express";
import errorResponse from "../utils/errorResponse.js";
import stripe from "../configs/stripe.config.js";
import { createCheckoutSession } from "../controllers/payment.controller.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = Router();

router.post("/create-checkout-session", createCheckoutSession);

router.get("/success", (req, res) => {
  res.send("success");
});
export default router;
