import express from "express";
import { verifyAuth } from "../../middleware/auth.middleware";
import { fetchContests } from "./contests.controller";

const router = express.Router();

router.get("/", verifyAuth, fetchContests)

export default router;
