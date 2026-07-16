import { Socket } from "socket.io";
import { verifyToken } from "../utils/jwt";

export const socketAuth = (socket: Socket, next: (err?: Error) => void) => {
  try {
    const token = socket.handshake.auth.token;

    if (!token) {
      console.warn("Socket auth failed: no token provided");
      return next(new Error("Unauthorized"));
    }

    const decoded = verifyToken(token);

    if (typeof decoded === "string") {
      console.warn("Socket auth failed: token decoded as string, not payload");
      return next(new Error("Unauthorized"));
    }

    socket.data.user = {
      id: decoded.id,
      type: decoded.role,
    };

    next();
  } catch (error) {
    console.error("Socket auth error:", error);
    next(new Error("Unauthorized"));
  }
};
