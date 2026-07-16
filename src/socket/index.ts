import { Server } from "socket.io";
import { registerChatEvents } from "./chat.socket";
import { getSubEmployerCompanyId } from "../modules/subEmployer";
import { registerNotificationEvents } from "./notifications.socket";

export const registerHandler = (io: Server) => {
  io.on("connection", async (socket) => {
    const user = socket.data.user;

    if (user?.id) {
      socket.join(user.id);
    }

    if (user?.type === "sub_employer") {
      try {
        const companyId =
          user.companyId || (await getSubEmployerCompanyId(user.id));

        if (companyId) {
          socket.join(companyId.toString());
          socket.data.user.companyId = companyId.toString();
        }
      } catch (err) {
        console.log(err);
      }
    }

    console.log(`user connected : ${socket.id}`);

    registerChatEvents(io, socket);
    registerNotificationEvents(io, socket);

    socket.on("disconnect", () => {
      console.log(`user disconnected : ${socket.id}`);
    });
  });
};
