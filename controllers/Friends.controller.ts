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

    if (
      requested.friends.includes(requester._id) ||
      requester.friends.includes(requested._id)
    )
      return next(errorResponse("users are already friends", 409));

    if (
      requested.friendRequests.includes(requester._id) ||
      requester.sentRequests.includes(requested._id)
    )
      return next(errorResponse("friend request already exists", 409));

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

export const acceptFriendRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      body: { userId, requesterId },
    } = req;

    if (!userId || !requesterId)
      return next(errorResponse("2 users are required", 400));

    let user = await checkUserById(userId);
    let requester = await checkUserById(requesterId);

    if (!user || !requester)
      return next(errorResponse("both users must be members ", 404));

    if (
      user.friends.includes(requester._id) ||
      requester.friends.includes(userId)
    )
      return next(errorResponse("users are already friends", 409));

    if (
      !user.friendRequests.includes(requester._id) ||
      !requester.sentRequests.includes(user._id)
    )
      return next(errorResponse("friend request does not exists"));

    await User.findOneAndUpdate(user._id, {
      $pull: {
        friendRequests: requester._id,
      },
      $push: {
        friends: requester._id,
      },
    });

    await User.findOneAndUpdate(requester._id, {
      $pull: {
        sentRequests: user?._id,
      },
      $push: {
        friends: user._id,
      },
    });

    res.status(200).json({
      status: true,
      message: "request was accepted",
    });
  } catch (error: any) {
    console.log("error-accept-friend-request", error.message);
    next(errorResponse("something went wrong", 500));
  }
};
