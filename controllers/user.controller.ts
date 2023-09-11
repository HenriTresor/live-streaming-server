import User from "../models/User.model.js";
import { Request, Response, NextFunction } from "express";
import userValidObject from "../validators/user.joi.js";
import errorResponse from "../utils/errorResponse.js";
import _ from "lodash";
import { checkUserByEmail } from "../services/User.services.js";

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { error, value } = userValidObject.validate(req.body);
    if (error) return next(errorResponse(error.message, 400));

    let user = await checkUserByEmail(value.email);
    if (user) return next(errorResponse("user already exists", 409));
    let newUser = await new User({
      email: value.email,
      fullName: value.fullName,
      password: value.password,
    }).save();

    if (!newUser._id) throw new Error();

    res.status(201).json({
      status: true,
      user: _.pick(newUser, ["email", "fullName"]),
    });
  } catch (error: any) {
    console.log("error-creating-user", error);
    next(errorResponse("something went wrong"));
  }
};
