import mongoose from "mongoose";
import AppError from "../../utils/AppError";
import { CreateUserInput, IUser, UpdateUserDetailsPayload } from "./user.types";
import User from "./user.model";

export const createUser = async (data: CreateUserInput) => {
  const userExists = await findUserByEmail(data.email);

  if (userExists) {
    throw new AppError("User already exists", 400);
  }

  console.log("creating suer");
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

export const findUserByPhone = async (phone: string) => {
  return User.findOne({ phone }).lean();
};

export const getUserDetails = async (userId: string) => {
  console.log("reached user detail service ");
  if (!userId) {
    throw new AppError("No user found", 404);
  }

  const user = await User.findById(userId);
  console.log(user);

  return user;
};

export const updateUserDetails = async (
  userId: string,
  data: UpdateUserDetailsPayload,
) => {
  if (!userId) {
    throw new AppError("No user found", 404);
  }

  const allowedFields = [
    "firstName",
    "lastName",
    "bio",
    "phone",
    "occupation",
    "skills",
    "location",
    "isPrivate",
    "profilePicture",
  ];

  const updateData: Record<string, unknown> = {};
  for (const key of allowedFields) {
    if (data[key as keyof typeof data] !== undefined) {
      updateData[key] = data[key as keyof typeof data];
    }
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: updateData },
    { new: true, runValidators: true },
  );

  if (!updatedUser) {
    throw new AppError("User not found", 404);
  }

  return updatedUser.toObject();
};

export const getTotalNumberOfUsers = async () => {
  return await User.countDocuments();
};

export const increaseFollowers = async (
  userId: string,
  session?: mongoose.ClientSession,
) => {
  await User.findByIdAndUpdate(
    userId,
    { $inc: { followersCount: 1 } },
    { session },
  );
};

export const increaseFollowingCount = async (
  userId: string,
  session?: mongoose.ClientSession,
) => {
  await User.findByIdAndUpdate(
    userId,
    { $inc: { followingCount: 1 } },
    { session },
  );
};

export const increasePostCount = async (
  userId: string,
  session?: mongoose.ClientSession,
) => {
  await User.findByIdAndUpdate(
    userId,
    { $inc: { postsCount: 1 } },
    { session },
  );
};

export const decreasePostCount = async (
  userId: string,
  session?: mongoose.ClientSession,
) => {
  await User.findByIdAndUpdate(
    userId,
    { $inc: { postsCount: -1 } },
    { session },
  );
};

export const userBlockService = async (
  userId: string,
  blockedUserId: string,
) => {
  if (!blockedUserId) {
    throw new AppError("No user found to block", 404);
  }

  await User.findByIdAndUpdate(userId, {
    $addToSet: { blockedUsers: blockedUserId },
  });

  return true;
};

export const userUnBlockService = async (
  userId: string,
  blockedUserId: string,
) => {
  if (!blockedUserId) {
    throw new AppError("No user found to unblock", 404);
  }

  await User.findByIdAndUpdate(userId, {
    $pull: { blockedUsers: blockedUserId },
  });

  return true;
};

export const blockEmployerService = async (
  userId: string,
  employerId: string,
) => {
  if (!employerId) {
    throw new AppError("No employer found to block", 404);
  }

  await User.findByIdAndUpdate(userId, {
    $addToSet: { blockedEmployers: employerId },
  });

  return true;
};

export const unBlockEmployerService = async (
  userId: string,
  employerId: string,
) => {
  if (!employerId) {
    throw new AppError("No employer found to unblock", 404);
  }

  await User.findByIdAndUpdate(userId, {
    $pull: { blockedEmployers: employerId },
  });

  return true;
};

export const getCurrentUserBlockedIds = async (userId: string) => {
  const doc = await User.findById(userId)
    .select("blockedUsers blockedEmployers")
    .lean();

  return new Set(
    [...(doc?.blockedUsers || []), ...(doc?.blockedEmployers || [])].map(
      String,
    ),
  );
};

export const getOtherUsersBlockMap = async (userIds: string[]) => {
  const users = await User.find({ _id: { $in: userIds } })
    .select("blockedUsers blockedEmployers")
    .lean();

  const map = new Map<string, Set<string>>();
  users.forEach((doc: any) => {
    map.set(
      doc._id.toString(),
      new Set(
        [...(doc.blockedUsers || []), ...(doc.blockedEmployers || [])].map(
          String,
        ),
      ),
    );
  });

  return map;
};
