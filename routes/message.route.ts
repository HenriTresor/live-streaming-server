import { Router } from "express";
import {
  createMessage,
  getMessages,
} from "../controllers/Message.controller.js";

const router = Router();

router.post("/add-msg", createMessage);
router.post("/", getMessages);

export default router;
