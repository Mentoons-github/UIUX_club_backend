import express from "express";
import { loadSetup } from "./loaders";
import { env } from "./config/env";
import http from "http";
import { socketInit } from "./config/socket";

const app = express();

loadSetup(app);

const server = http.createServer(app);
socketInit(server);

server.listen(env.PORT, () => {
  console.log(`Server running on PORT ${env.PORT}`);
});
