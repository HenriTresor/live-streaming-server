import { Router } from "express";
// import upload from "../configs/multer.config.js";
import { getVideos, uploadVideo } from "../controllers/Video.controller.js";
import multer from "multer";

const router = Router();

const upload = multer({ dest: "uploads" });

router.post("/", upload.single("video"), uploadVideo);
router.get("/", getVideos);

export default router;
