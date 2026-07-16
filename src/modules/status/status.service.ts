import mongoose from "mongoose";
import AppError from "../../utils/AppError";
import { StatusModel } from "./status.model";
import { Status } from "./status.types";

export const statusUpload = async ({
  data,
  userId,
}: {
  data: Status;
  userId: string;
}) => {
  const base = { user: userId, type: data.type };
  let statusData;
  if (data.type === "text") {
    console.log("creating text object");
    statusData = {
      ...base,
      text: data.text,
      textColor: data.textColor,
      backgroundColor: data.backgroundColor,
    };
  } else {
    statusData = {
      ...base,
      ...(data.caption && { caption: data.caption }),
      media: data.media,
    };
  }

  const status = await StatusModel.create(statusData);

  return status;
};

export const recordStatusView = async ({
  userId,
  statusIds,
}: {
  userId: string;
  statusIds: string[];
}) => {
  if (statusIds.length === 0) {
    throw new AppError("No status found", 404);
  }

  const userObjectId = new mongoose.Types.ObjectId(userId);
  const statusObjectIds = statusIds.map(
    (id) => new mongoose.Types.ObjectId(id),
  );

  const status = await StatusModel.updateMany(
    {
      _id: { $in: statusObjectIds },
      "viewers.user": { $ne: userObjectId },
    },
    {
      $addToSet: {
        viewers: {
          user: userObjectId,
          viewedAt: new Date(),
        },
      },
      $inc: {
        viewersCount: 1,
      },
    },
  );

  return status;
};

export const fetchStatus = async ({
  page,
  limit,
  userId,
}: {
  page: number;
  limit: number;
  userId: string;
}) => {
  const skip = (page - 1) * limit;
  const userObjectId = new mongoose.Types.ObjectId(userId);

  const statuses = await StatusModel.aggregate([
    {
      $match: {
        expiresAt: { $gt: new Date() },
      },
    },
    {
      $addFields: {
        isViewed: {
          $in: [userObjectId, "$viewers.user"],
        },
      },
    },
    {
      $group: {
        _id: "$user",
        statuses: { $push: "$$ROOT" },
        allViewed: { $min: { $cond: ["$isViewed", 1, 0] } },
      },
    },
    {
      $addFields: {
        isViewed: { $eq: ["$allViewed", 1] },
        statuses: {
          $sortArray: {
            input: "$statuses",
            sortBy: { createdAt: 1 },
          },
        },
      },
    },
    {
      $sort: {
        isViewed: 1,
      },
    },
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
    {
      $project: {
        _id: 0,
        isViewed: 1,
        user: {
          _id: "$user._id",
          name: {
            $concat: [
              { $ifNull: ["$user.firstName", ""] },
              " ",
              { $ifNull: ["$user.lastName", ""] },
            ],
          },
          profilePicture: "$user.profilePicture",
        },
        statuses: {
          $map: {
            input: "$statuses",
            as: "slide",
            in: {
              _id: "$$slide._id",
              type: "$$slide.type",
              text: "$$slide.text",
              backgroundColor: "$$slide.backgroundColor",
              textColor: "$$slide.textColor",
              media: "$$slide.media",
              caption: "$$slide.caption",
              viewers: "$$slide.viewers",
              viewersCount: "$$slide.viewersCount",
              isViewed: "$$slide.isViewed",
              expiresAt: "$$slide.expiresAt",
              createdAt: "$$slide.createdAt",
              updatedAt: "$$slide.updatedAt",
            },
          },
        },
      },
    },
  ]);

  return statuses;
};

export const deleteExpiredStatus = async (limit: number = 1) => {
  const query = StatusModel.find({
    expiresAt: { $lte: new Date() },
  }).limit(limit);

  const expiredStatuses = await query;

  if (!expiredStatuses.length) return;

  await Promise.all(
    expiredStatuses.map((status) => StatusModel.deleteOne({ _id: status._id })),
  );
};

export const statusSeenUsers = async (statusId: string) => {
  if (!statusId) {
    throw new AppError("Status ID is required", 400);
  }

  const status = await StatusModel.findById(statusId)
    .select("user viewers viewersCount")
    .populate({
      path: "viewers.user",
      select: "firstName lastName profilePicture",
    });

  if (!status) {
    throw new AppError("Status not found", 404);
  }

  const viewers = status.viewers
    .filter((v) => v.user && v.user._id.toString() !== status.user.toString())
    .sort((a, b) => b.viewedAt.getTime() - a.viewedAt.getTime());

  return {
    total: viewers.length,
    viewers,
  };
};
