import mongoose from "mongoose";
import bcrypt from "bcrypt";

export interface User {
  email: string;
  fullName: string;
  password: string;
  friends: any[];
  sentRequests: any[];
  friendRequests: any[];
  followers: any[];
  following: any[];
  coins: number;
}

const UserSchema = new mongoose.Schema<User>(
  {
    email: { type: String, required: true, unique: true, trim: true },
    fullName: { type: String, required: true, trim: true },
    password: { type: String, required: true, trim: true },
    friendRequests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],

    sentRequests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    coins: { type: Number, default: 0 },
  },

  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function () {
  try {
    const hashedPwd = await bcrypt.hash(this.password, 10);
    this.password = hashedPwd;
  } catch (error: any) {
    console.log("error hasing password", error.message);
  }
});

export default mongoose.model<User>("users", UserSchema);
