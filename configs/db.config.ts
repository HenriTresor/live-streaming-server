import mongoose, { Error } from "mongoose";

export default async () => {
  try {
    return mongoose.connect(
      process.env.MONGO_URL || "mongodb://127.0.0.1:27017/live-stream"
    );
  } catch (error: any) {
    console.log("error connecting to Mongoose", error.message);
  }
};
