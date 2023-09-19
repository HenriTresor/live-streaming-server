import mongoose from "mongoose";

type IGift = {
  amount: number;
  priceInCoins: number;
  user: typeof mongoose.Schema.Types.ObjectId;
};

const GiftSchema = new mongoose.Schema<IGift>(
  {
    amount: { type: Number, required: true },
    priceInCoins: { type: Number, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("gifts", GiftSchema);
