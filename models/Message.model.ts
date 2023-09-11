import mongoose from "mongoose";

type IMessage = {
  sender: typeof mongoose.Schema.Types.ObjectId;
  receiver: typeof mongoose.Schema.Types.ObjectId;
  message: {
    text: string;
    image: string;
  };
  users: [typeof mongoose.Schema.Types.ObjectId];
};

const MessageSchema = new mongoose.Schema<IMessage>(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    receiver: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    users: [
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

MessageSchema.pre("save", async function () {
  this.users.push(this.sender);
  this.users.push(this.receiver);
});

export default mongoose.model("messages", MessageSchema);
