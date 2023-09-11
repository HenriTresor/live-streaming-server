import { NextFunction, Request, Response } from "express";
import Message from "../models/Message.model.js";
import errorResponse from "../utils/errorResponse.js";
import { io } from "../configs/app.config.js";

export const createMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      body: { sender, receiver, message },
    } = req;

    if (!sender || !receiver || !message)
      return next(
        errorResponse("sender, receiver and message are all required")
      );

    let newMessage = new Message({
      sender,
      receiver,
      message,
    });
    await newMessage.save();
    res.status(201).json({
      status: true,
      message: "new message added successfully",
    });
  } catch (error: any) {
    console.log("error-adding-message", error.message);
    next(errorResponse("something went wrong", 500));
  }
};

export const getMessages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      body: { users },
    } = req;

    if (!users) return next(errorResponse("users are required", 400));

    let messages = await Message.find({ users })
      .populate("sender")
      .populate("receiver");

    res.status(200).json({
      status: true,
      messages,
    });
  } catch (error: any) {
    console.log("error-adding-message", error.message);
    next(errorResponse("something went wrong", 500));
  }
};
