import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export default (id: string) => {
  return jwt.sign(id, process.env.ACCESS_SECRET_TOKEN as string, {
    expiresIn: "1w",
  });
};
