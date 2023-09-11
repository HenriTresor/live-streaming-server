import mongoose from "mongoose";

type IMessage = {
  sender: typeof mongoose.Schema.Types.ObjectId;
  receiver: [typeof mongoose.Schema.Types.ObjectId];
  message: {
    text: string;
    image: string;
  };
};

const MessageSchema = new mongoose.Schema<IMessage>(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      trim: true,
    },
    receiver: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    message: {
      text: { type: String },
      image: { type: String },
    },
  },
  {
    timestamps: true,
  }
);


export default mongoose.model('messages', MessageSchema)
