import asyncHandler from "express-async-handler";
import {
  blockEmployerService,
  getUserDetails,
  unBlockEmployerService,
  updateUserDetails,
  userBlockService,
  userUnBlockService,
} from "./user.service";
import { successResponse } from "../../utils";
import { uploadFile } from "../media";
import { UpdateUserDetailsPayload } from "./user.types";

export const getUserDetail = asyncHandler(async (req, res) => {
  const userId = req.params.userId as string;
  console.log("userId :", userId);

  const user = await getUserDetails(userId);
  return successResponse(res, 200, "User fetched successfully", user);
});

export const updateUserDetail = asyncHandler(async (req, res) => {
  const userId = req.params.userId as string;

  let profilePictureUrl: string | undefined;

  if (req.file) {
    const uploaded = await uploadFile(req.file, userId);
    profilePictureUrl = uploaded.url;
  }

  const payload: UpdateUserDetailsPayload = {
    ...req.body,
    ...(profilePictureUrl && { profilePicture: profilePictureUrl }),
  };

  const updatedUser = await updateUserDetails(userId, payload);
  return successResponse(res, 200, "Profile updated successfully", updatedUser);
});

export const blockUser = asyncHandler(async (req, res) => {
  const userId = req.user!.id;
  const blockedUserId = req.params.userId as string;

  await userBlockService(userId, blockedUserId);

  return successResponse(res, 200, "User blocked");
});

export const unBlockUser = asyncHandler(async (req, res) => {
  const userId = req.user!.id;
  const blockedUserId = req.params.userId as string;

  await userUnBlockService(userId, blockedUserId);

  return successResponse(res, 200, "User unblocked");
});

export const blockEmployer = asyncHandler(async (req, res) => {
  const userId = req.user!.id;
  const employerId = req.params.employerId as string;

  await blockEmployerService(userId, employerId);

  return successResponse(res, 200, "Employer blocked");
});

export const unBlockEmployer = asyncHandler(async (req, res) => {
  const userId = req.user!.id;
  const employerId = req.params.employerId as string;

  await unBlockEmployerService(userId, employerId);

  return successResponse(res, 200, "Employer unblocked");
});
