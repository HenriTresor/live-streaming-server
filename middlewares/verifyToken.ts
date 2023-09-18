import { NextFunction, Request, Response } from "express";
import errorResponse from "../utils/errorResponse.js";
import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "dotenv";

config();

interface Payload extends JwtPayload {
  id?: string;
}

export default async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return next(errorResponse("auth header is required", 403));

    let token = authHeader.split(" ")[1];
    if (!token) throw new Error("token is required");

    let decodedToken: Payload | string = jwt.verify(
      token,
      `${process.env.ACCESS_SECRET_TOKEN}`
    );

    if (!decodedToken) throw new Error();
    req.userId = decodedToken;
    next();
  } catch (error: any) {
    next(errorResponse(error.message, 401));
  }
};
