import { Server } from "socket.io";
import { env } from "../config/env";
import { registerHandler } from "../socket";
import { socketAuth } from "../middleware/socketAuth.middleware";

let io: Server;

export const socketInit = (server: any) => {
  io = new Server(server, {
    cors: {
      origin: env.CLIENT_URL,
      credentials: true,
    },
    maxHttpBufferSize: 10 * 1024 * 1024,
  });

  io.engine.on("connection_error", (err) => {
    console.error("Socket engine connection error:", {
      code: err.code,
      message: err.message,
      context: err.context,
    });
  });

  io.use(socketAuth);

  registerHandler(io);

  return io;
};

export const getIO = () => io;
