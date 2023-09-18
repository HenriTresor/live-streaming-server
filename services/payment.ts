import CoinsModel from "../models/Coins.model.js";

export const getCoins = async () => {
  try {
    const coins = await CoinsModel.find();
    return coins;
  } catch (error: any) {
    console.log("error getting coins", error.message);
  }
};
