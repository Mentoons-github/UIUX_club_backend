import express from "express";
import { getLinkPreview } from "./linkPreview.controller";

const router = express.Router();

router.get("/", getLinkPreview);

export default router;
