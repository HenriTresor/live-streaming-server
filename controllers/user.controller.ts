import User from "../models/User.model.js";
import { Request, Response, NextFunction } from "express";

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, fullName, password } = req.body;
};
