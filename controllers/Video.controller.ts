import { NextFunction, Request, Response } from "express";
import Video from "../models/Video.model.js";
import errorResponse from "../utils/errorResponse.js";

export const uploadVideo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { file } = req;
  } catch (error) {
    console.log("error-creating-video", error);
    next(errorResponse("something went wrong"));
  }
};
