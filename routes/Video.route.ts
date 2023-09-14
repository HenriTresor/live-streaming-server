import { Router } from "express";
import upload from "../configs/multer.config.js";
import { uploadVideo } from "../controllers/Video.controller.js";

const router = Router();

router.post("/", upload.single("video"), uploadVideo);

export default router;
