import AppError from "../../utils/AppError";
import { JwtPayload } from "../auth";
import { getUserAndModelType } from "./notifications.helper";
import NotificationModel from "./notifications.model";
import { ICreateNotification } from "./notifications.types";

export const getMyNotifications = async (
  limit: number,
  page: number,
  userData: JwtPayload,
) => {
  const skip = (page - 1) * limit;
  const { user, receiverModel } = await getUserAndModelType(userData);

  const [notifications, total] = await Promise.all([
    NotificationModel.find({
      receiver: user._id,
      receiverModel,
    })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    NotificationModel.countDocuments({ receiver: user._id, receiverModel }),
  ]);
  return {
    notifications,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    },
  };
};

export const createNotificationService = async (data: ICreateNotification) => {
  const notification = await NotificationModel.create(data);
  return notification;
};

export const deleteNotification = async (
  notificationId: string,
  userData: JwtPayload,
) => {
  if (!notificationId) throw new AppError("No notifications found", 404);
  const { user, receiverModel } = await getUserAndModelType(userData);
  await NotificationModel.findOneAndDelete({
    _id: notificationId,
    receiver: user._id,
    receiverModel,
  });
  return;
};

export const deleteAllNotifications = async (userData: JwtPayload) => {
  const { user, receiverModel } = await getUserAndModelType(userData);
  await NotificationModel.deleteMany({
    receiver: user._id,
    receiverModel,
  });

  return;
};

export const markAsRead = async (
  notificationId: string,
  userData: JwtPayload,
) => {
  const { user, receiverModel } = await getUserAndModelType(userData);
  await NotificationModel.findOneAndUpdate(
    { _id: notificationId, receiver: user._id, receiverModel },
    {
      $set: {
        readAt: new Date(),
        isRead: true,
      },
    },
  );

  return;
};

export const markAllAsRead = async (userData: JwtPayload) => {
  const { user, receiverModel } = await getUserAndModelType(userData);

  if (!user) {
    throw new Error("User not found");
  }

  await NotificationModel.updateMany(
    {
      receiver: user._id,
      receiverModel,
      isRead: false,
    },
    {
      $set: {
        isRead: true,
        readAt: new Date(),
      },
    },
  );

  return;
};
