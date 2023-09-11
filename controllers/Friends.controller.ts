import { NextFunction, Request, Response } from "express";
import User from "../models/User.model.js";
import errorResponse from "../utils/errorResponse.js";
import { checkUserById } from "../services/User.services.js";

export const sendFriendRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      body: { requesterId, requestId },
    } = req;

    let requester = await checkUserById(requesterId);
    let requested = await checkUserById(requestId);

    if (!requested || !requester)
      return next(errorResponse("all users must be members", 404));

    const updatedRequested = await User.findOneAndUpdate(requested._id, {
      $push: {
        friendRequests: requester._id,
      },
    });

    const updatedRequester = await User.findOneAndUpdate(requester._id, {
      $push: {
        friendRequests: requested._id,
      },
    });

    return res.status(201).json({
      status: true,
      message: "friend requests was sent successfully",
    });
      
      
  } catch (error: any) {
    console.log("error-sending-friend-request", error.message);

    next(errorResponse("something went wrong", 500));
  }
};
