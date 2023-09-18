import { NextFunction, Request, Response } from "express";
import User from "../models/User.model.js";
import errorResponse from "../utils/errorResponse.js";
import { checkUserByEmail } from "../services/User.services.js";
import { compare } from "bcrypt";
import _ from "lodash";
import createToken from "../utils/createToken.js";

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      body: { email, password },
    } = req;

    if (!email || !password)
      return next(errorResponse("email and password must be provided", 400));
    const user = await checkUserByEmail(email);
    if (!user) return next(errorResponse("invalid email address", 404));

    let isCorrectPassword = await compare(password, user.password);
    if (!isCorrectPassword) return next(errorResponse("invalid password", 403));

    const token = createToken(`${user._id}`);
    res.status(200).json({
      status: true,
      token,
      user: _.pick(user, [
        "email",
        "fullName",
        "_id",
        "createdAt",
        "updatedAt",
      ]),
    });
  } catch (error: any) {
    console.log("error-logging-in", error.message);
    next(errorResponse("something went wrong", 500));
  }
};
