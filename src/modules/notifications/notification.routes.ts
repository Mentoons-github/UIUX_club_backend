import express from "express";
import {
  createNotification,
  deleteAllUserNotifications,
  deleteSingleNotification,
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "./notifications.controller";
import { verifyAuth } from "../../middleware/auth.middleware";

const router = express.Router();

router.get("/", verifyAuth, getNotifications);

router.post("/", verifyAuth, createNotification);

router.patch("/:notificationId/read", verifyAuth, markNotificationAsRead);

router.patch("/read-all", verifyAuth, markAllNotificationsAsRead);

router.delete("/:notificationId", verifyAuth, deleteSingleNotification);

router.delete("/", verifyAuth, deleteAllUserNotifications);

export default router;
