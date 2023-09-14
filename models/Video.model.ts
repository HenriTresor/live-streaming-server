import mongoose from "mongoose";

type IVideo = {
  link: string;
  uploader: typeof mongoose.Schema.Types.ObjectId;
};

const VideoSchema = new mongoose.Schema<IVideo>(
  {
    link: { type: String, required: true, trim: true },
    uploader: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("videos", VideoSchema);
