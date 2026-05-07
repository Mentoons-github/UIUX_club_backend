import { setUpMiddleware } from "./express";
import { dbConnect } from "../config/db";
import { Application } from "express";
import errorHandler from "../middleware/error.middleware";
import routes from "../routes";

export const loadSetup = (app: Application) => {
  setUpMiddleware(app);
  dbConnect();
  app.use("/api/v1", routes);
  app.use(errorHandler);
};
