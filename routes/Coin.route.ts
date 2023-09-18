import { Router } from "express";
import { createCoin } from "../controllers/Coin.controller.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = Router();

router.post("/", verifyToken, createCoin);

export default router;
