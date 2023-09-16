import { Router } from "express";
// import upload from "../configs/multer.config.js";
import { uploadVideo } from "../controllers/Video.controller.js";
import multer from "multer";

const router = Router();

const upload = multer({ dest: "uploads" });

router.post("/", upload.single("video"), uploadVideo);

export default router;
