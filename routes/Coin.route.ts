import { Router } from "express";
import { createCoin } from "../controllers/Coin.controller.js";

const router = Router();

router.post("/", createCoin);

export default router;
