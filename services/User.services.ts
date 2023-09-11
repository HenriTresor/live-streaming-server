import User from "../models/User.model.js";

export const checkUserById = async (id: string) => {
  try {
    let user = await User.findById(id);
    if (user) return user;
    return false;
  } catch (error: any) {
    return false;
  }
};

export const checkUserByEmail = async (email: string) => {
  try {
    let user = await User.findOne({ email: email });
    if (user) return user;
    return false;
  } catch (error: any) {
    return false;
  }
};
