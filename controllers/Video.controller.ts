import { NextFunction, Request, Response } from "express";
import Video from "../models/Video.model.js";
import errorResponse from "../utils/errorResponse.js";
import { v2, UploadApiResponse } from "cloudinary";
import fs from "fs";

export const uploadVideo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      file,
      body: { uploader },
    } = req;

    const uploadVideoAsync = async (): Promise<UploadApiResponse> => {
      const response: any = await new Promise((resolve, reject) => {
        v2.uploader.upload_large(
          `${file?.path}`,
          { resource_type: "video" },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
      });

      return response;
    };

    const uploadResult = await uploadVideoAsync();
    if (!uploadResult.secure_url) {
      fs.unlink(`${file?.path}`, (err) => {
        if (err) return console.log("failed to delete file", err.message);
        console.log("file deleted");
      });
      throw new Error("error uploading file");

      return;
    }
    fs.unlink(`${file?.path}`, (err) => {
      if (err) return console.log("failed to delete file", err.message);
      console.log("file deleted");
    });

    const newVideo = new Video({
      link: uploadResult.secure_url,
      uploader,
    });

    await newVideo.save();

    res.status(201).json({
      status: true,
      message: "video uploaded successfully",
      video: newVideo,
    });
  } catch (error) {
    console.log("error-creating-video", error);
    next(errorResponse("something went wrong"));
  }
};
