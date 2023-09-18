import { Router } from "express";
// import upload from "../configs/multer.config.js";
import { getVideos, uploadVideo } from "../controllers/Video.controller.js";
import multer from "multer";
import verifyToken from "../middlewares/verifyToken.js";

const router = Router();

const upload = multer({ dest: "uploads" });

router.post("/", verifyToken, upload.single("video"), uploadVideo);
router.get("/", verifyToken, getVideos);

export default router;
