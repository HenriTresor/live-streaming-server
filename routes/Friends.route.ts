import { Router } from "express";
import {
  acceptFriendRequest,
  sendFriendRequest,
} from "../controllers/Friends.controller.js";

const router = Router();

router.post("/", sendFriendRequest);
router.post("/accept", acceptFriendRequest);

export default router;
