import { Application } from "express";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { env } from "../config/env";
import morgan from "morgan";

export const setUpMiddleware = (app: Application) => {
  app.use(
    cors({
      origin: "*",
    }),
  );

  if (env.NODE_ENV === "production") {
    app.use(helmet());
  }

  app.use(morgan("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
};
