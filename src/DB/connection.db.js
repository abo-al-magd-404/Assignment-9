import mongoose from "mongoose";
import { DB_URI } from "../../config/config.service.js";
import { userModel } from "./models/user.model.js";

export const connectDB = async () => {
  try {
    const result = await mongoose.connect(DB_URI);
    console.log("DB Connected Successfully ✔ 💙");
    await userModel.syncIndexes();
  } catch (error) {
    console.log(`Fail To Connect On DB ❌`);
    console.log(error);
  }
};
