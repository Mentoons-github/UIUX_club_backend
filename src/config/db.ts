import mongoose from "mongoose";
import { env } from "./env";

export const dbConnect = async () => {
  await mongoose.connect(env.DB_URI!);
  console.log("mongoDB connected");
};
