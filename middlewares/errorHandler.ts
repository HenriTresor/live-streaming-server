import { NextFunction, Request, Response } from "express";

export default (err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || 500).json({
    status: false,
    message: err.message,
  });
};
