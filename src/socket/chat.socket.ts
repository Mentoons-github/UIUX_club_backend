import { Server, Socket } from "socket.io";
import {
  createMessage,
  markMessagesAsSeen,
  resolveSenderContext,
} from "../modules/chat/message.service";
import { SendMessagePayload } from "../modules/chat/message.types";

const registerChatEvents = (io: Server, socket: Socket) => {
  socket.on("send-message", async (data: SendMessagePayload) => {
    try {
      const user = socket.data.user;

      if (!user?.id || !user?.type) {
        socket.emit("error", { message: "Unauthorized" });
        return;
      }

      const context = await resolveSenderContext({
        id: user.id,
        role: user.type,
        name: user.name,
        companyId: user.companyId,
      });

      const message = await createMessage({
        senderId: context.senderId,
        senderType: context.senderType,
        senderName: context.senderName,
        conversationParticipantId: context.conversationParticipantId,
        conversationParticipantType: context.conversationParticipantType,
        receiverId: data.receiverId,
        receiverType: data.receiverType,
        conversationId: data.conversationId,
        type: data.type,
        content: data.content,
        file: data.file,
      });

      socket.emit("message-sent", message);
      io.to(data.receiverId).emit("receive-message", message);

      if (context.conversationParticipantType === "Employer") {
        socket
          .to(context.conversationParticipantId)
          .emit("receive-message", message);
      }
    } catch (error) {
      socket.emit("error", { message: "Failed to send message" });
    }
  });

  socket.on(
    "typing",
    (data: { receiverId: string; conversationId: string }) => {
      const user = socket.data.user;
      if (!user?.id) return;

      io.to(data.receiverId).emit("typing", {
        conversationId: data.conversationId,
        senderId: user.id,
      });
    },
  );

  socket.on(
    "stop-typing",
    (data: { receiverId: string; conversationId: string }) => {
      const user = socket.data.user;
      if (!user?.id) return;

      io.to(data.receiverId).emit("stop-typing", {
        conversationId: data.conversationId,
        senderId: user.id,
      });
    },
  );

  socket.on(
    "mark-seen",
    async (data: { conversationId: string; senderId: string }) => {
      const user = socket.data.user;
      if (!user?.id) return;

      const result = await markMessagesAsSeen(data.conversationId, user.id);

      if (result.messageIds.length === 0) return;

      io.to(data.senderId).emit("messages-seen", {
        conversationId: data.conversationId,
        seenBy: user.id,
        messageIds: result.messageIds,
        seenAt: result.seenAt,
      });
    },
  );
};

export { registerChatEvents };
