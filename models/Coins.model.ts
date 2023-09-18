import mongoose from "mongoose";

type ICoin = {
  amount: number;
  price: number;
};

const CoinSchema = new mongoose.Schema<ICoin>(
  {
    amount: { type: Number, required: true, trim: true, unique: true },
    price: { type: Number, required: true, trim: true },
  },
  {
    timestamps: true,
  }
);


export default mongoose.model('coins', CoinSchema)