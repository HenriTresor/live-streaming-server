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

    if (!requestId || !requesterId)
      return next(errorResponse("2 users are required", 400));

    if (requesterId === requestId)
      return next(
        errorResponse("User does not send friends requests to themself", 409)
      );

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
        sentRequests: requested._id,
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
