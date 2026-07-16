import AppError from "../../../utils/AppError";
import { createFollow } from "../follow.service";
import FollowRequestModel from "./followRequest.model";
import FollowModel from "../follow.model";

type RequestAction = "accepted" | "rejected";

export const updateFollowRequest = async (
  senderId: string,
  receiverId: string,
  action: RequestAction,
) => {
  if (senderId === receiverId) {
    throw new AppError("You cannot perform this action on yourself", 400);
  }

  const request = await FollowRequestModel.findOne({
    sender: senderId,
    receiver: receiverId,
  });

  if (!request) {
    throw new AppError("No request found", 404);
  }

  if (request.status !== "pending") {
    throw new AppError("Request already processed", 400);
  }

  if (action === "accepted") {
    request.status = "accepted";
    await request.save();
    await createFollow(senderId, receiverId);

    const followsBack = !!(await FollowModel.findOne({
      follower: receiverId,
      following: senderId,
    }));

    return { message: "Follow request accepted", followsBack };
  }

  if (action === "rejected") {
    await request.deleteOne();
    return { message: "Follow request rejected" };
  }
};

export const sendFollowRequest = async (
  senderId: string,
  receiverId: string,
) => {
  const existing = await FollowRequestModel.findOne({
    sender: senderId,
    receiver: receiverId,
    status: "pending",
  });

  if (existing) {
    throw new AppError("Follow request already sent", 409);
  }

  return await FollowRequestModel.create({
    sender: senderId,
    receiver: receiverId,
    status: "pending",
  });
};
