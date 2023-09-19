import mongoose from "mongoose";

type IGift = {
  amount: number;
  priceInCoins: number;
};

const GiftSchema = new mongoose.Schema<IGift>(
  {
    amount: { type: Number, required: true },
    priceInCoins: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("gifts", GiftSchema);
