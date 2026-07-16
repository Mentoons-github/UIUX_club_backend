import { Server, Socket } from "socket.io";
import { markAllAsRead, markAsRead } from "../modules/notifications";

interface MarkReadPayload {
  notificationId: string;
}

const registerNotificationEvents = (io: Server, socket: Socket) => {
  const user = socket.data.user;

  socket.on(
    "notification:mark_read",
    async ({ notificationId }: MarkReadPayload) => {
      if (!user?.id) return;

      try {
        await markAsRead(notificationId, user);
        io.to(user.id.toString()).emit("notification:read", { notificationId });
      } catch (err) {
        socket.emit("error", {
          message: "Failed to mark notification as read",
        });
      }
    },
  );

  socket.on("notification:mark_all_read", async () => {
    if (!user?.id) return;

    try {
      await markAllAsRead(user);
      io.to(user.id.toString()).emit("notification:all_read");
    } catch (err) {
      socket.emit("error", {
        message: "Failed to mark all notifications as read",
      });
    }
  });
};

export { registerNotificationEvents };
