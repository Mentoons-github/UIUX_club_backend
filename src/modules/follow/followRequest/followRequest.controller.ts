import asyncHandler from "express-async-handler";
import { updateFollowRequest } from "./followRequest.service";
import { successResponse } from "../../../utils";

export const acceptFollowRequest = asyncHandler(async (req, res) => {
  const receiverId = req.user!.id;
  const senderId = req.params.senderId as string;

  const result = await updateFollowRequest(senderId, receiverId, "accepted");

  return successResponse(res, 200, "Follow request accepted", result);
});

export const rejectFollowRequest = asyncHandler(async (req, res) => {
  const receiverId = req.user!.id;
  const senderId = req.params.senderId as string;

  const result = await updateFollowRequest(senderId, receiverId, "rejected");

  return successResponse(res, 200, "Follow request rejected", result);
});
