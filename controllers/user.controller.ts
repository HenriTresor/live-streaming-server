import User from "../models/User.model.js";
import { Request, Response, NextFunction } from "express";
import userValidObject from "../validators/user.joi.js";
import errorResponse from "../utils/errorResponse.js";

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, fullName, password } = req.body;

    const { error, value } = userValidObject.validate({
      email,
      fullName,
      password,
    });

    if (error) return errorResponse(error.message, 400);

    let newUser = await new User({
      email: value.email,
      fullName: value.fullName,
      password: value.password,
    }).save();
  } catch (error: any) {
    console.log("error-creating-user", error.message);
    next(errorResponse("something went wrong"));
  }
};
