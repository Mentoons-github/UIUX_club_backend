import AppError from "../../utils/AppError";
import { IUser } from "./user";
import User from "./User.model";

export const createUser = async (data: IUser) => {
  const userExists = await findUserByEmail(data.email);

  if (userExists) {
    throw new AppError("User already exists", 400);
  }

  return await User.create({ ...data, role: "user" });
};

export const findUserByEmail = async (email: string) => {
  const user = await User.findOne({ email });
  return user;
};

export const findUserById = async (id: string) => {
  const user = await User.findById(id);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};
