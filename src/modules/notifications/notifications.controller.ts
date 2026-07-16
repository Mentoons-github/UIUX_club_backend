import asyncHandler from "express-async-handler";
import { MODEL_MAP } from "../../constants/roles.constants";
import {
  createNotificationService,
  deleteAllNotifications,
  deleteNotification,
  getMyNotifications,
  markAllAsRead,
  markAsRead,
} from "./notifications.service";
import { getIO } from "../../config/socket";

export const createNotification = asyncHandler(async (req, res) => {
  const { data } = req.body;
  const { id, role } = req.user!;

  const notificationData = {
    ...data,
    sender: id,
    senderModel: MODEL_MAP[role as keyof typeof MODEL_MAP],
  };

  const notification = await createNotificationService(notificationData);

  getIO().to(notification.receiver.toString()).emit("notification:new", notification);

  res.status(201).json({
    success: true,
    message: "Notification created successfully.",
    data: notification,
  });
});

export const getNotifications = asyncHandler(async (req, res) => {
  const limit = Number(req.query.limit) || 10;
  const page = Number(req.query.page) || 1;

  const notifications = await getMyNotifications(limit, page, req.user!);

  res.status(200).json({
    success: true,
    ...notifications,
  });
});

export const deleteSingleNotification = asyncHandler(async (req, res) => {
  const notificationId = req.params.notificationId as string;

  await deleteNotification(notificationId, req.user!);

  res.status(200).json({
    success: true,
    message: "Notification deleted successfully.",
  });
});

export const deleteAllUserNotifications = asyncHandler(async (req, res) => {
  await deleteAllNotifications(req.user!);

  res.status(200).json({
    success: true,
    message: "All notifications deleted successfully.",
  });
});

export const markNotificationAsRead = asyncHandler(async (req, res) => {
  const notificationId = req.params.notificationId as string;

  await markAsRead(notificationId, req.user!);

  res.status(200).json({
    success: true,
    message: "Notification marked as read.",
  });
});

export const markAllNotificationsAsRead = asyncHandler(async (req, res) => {
  await markAllAsRead(req.user!);

  res.status(200).json({
    success: true,
    message: "All notifications marked as read.",
  });
});
