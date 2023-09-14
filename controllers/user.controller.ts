import User from "../models/User.model.js";
import { Request, Response, NextFunction } from "express";
import userValidObject from "../validators/user.joi.js";
import errorResponse from "../utils/errorResponse.js";
import _ from "lodash";
import { checkUserByEmail } from "../services/User.services.js";
import createToken from "../utils/createToken.js";

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

    const token = createToken(`${newUser._id}`);
    res.status(201).json({
      status: true,
      token,
      user: _.pick(newUser, [
        "email",
        "fullName",
        "_id",
        "createdAt",
        "updatedAt",
      ]),
    });
  } catch (error: any) {
    console.log("error-creating-user", error);
    next(errorResponse("something went wrong"));
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { body } = req;
    const {
      params: { id },
    } = req;

    await User.findOneAndUpdate({ _id: id }, { $set: { ...body } });

    res.status(200).json({
      status: true,
      message: "user was updated successfully",
    });
  } catch (error) {
    console.log("error-updating-user", error);
    next(errorResponse("something went wrong"));
  }
};
