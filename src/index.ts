import express from "express";
import { loadSetup } from "./loaders";
import { env } from "./config/env";

const app = express();

loadSetup(app);

app.get("/health", () => {
  console.log("server running perfectly");
});

app.listen(env.PORT, () => {
  console.log(`Server running on PORT ${env.PORT}`);
});
