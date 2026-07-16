import express from "express";
import {
  getStatus,
  createStatus,
  viewStatus,
  getStatusViewedUsers,
} from "./status.controller";
import { verifyAuth } from "../../middleware/auth.middleware";
import { upload } from "../media/media.middleware";

const router = express.Router();

router.use(verifyAuth);

router.route("/").get(getStatus).post(upload.array("media", 10), createStatus);

router.post("/viewed", viewStatus);
router.get("/:statusId/viewers", getStatusViewedUsers);
export default router;
