import mongoose from "mongoose";
import bcrypt from "bcrypt";

interface User {
  email: string;
  fullName: string;
  password: string;
}

const UserSchema = new mongoose.Schema<User>(
  {
    email: { type: String, required: true, unique: true, trim: true },
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
