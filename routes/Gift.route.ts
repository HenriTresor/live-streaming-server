import { Router } from "express";
import verifyToken from "../middlewares/verifyToken.js";
import { buyGift } from "../controllers/Gift.controller.js";

const router = Router();

router.post("/", verifyToken, buyGift);

export default router;
