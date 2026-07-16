import express from "express";
import { authRoutes } from "../modules/auth";
import { otpRoutes } from "../modules/otp";
import { postRoutes } from "../modules/post";
import { statusRoutes } from "../modules/status";
import { userRoutes } from "../modules/user";
import { jobRoutes } from "../modules/jobs";
import { designShowcaseRoutes } from "../modules/designShowcase";
import { linkPreviewRoutes } from "../modules/linkPreview";
import { followRoutes } from "../modules/follow";
import { messageRoutes } from "../modules/chat";
import { employerRoutes } from "../modules/employer";
import { reportRoutes } from "../modules/report";
import { subEmployerRoutes } from "../modules/subEmployer";
import { NotificationRoutes } from "../modules/notifications";
import { contestsRoutes } from "../modules/contests";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/otp", otpRoutes);
router.use("/users", userRoutes);
router.use("/post", postRoutes);
router.use("/status", statusRoutes);
router.use("/jobs", jobRoutes);
router.use("/showcase", designShowcaseRoutes);
router.use("/follow", followRoutes);
router.use("/linkpreview", linkPreviewRoutes);
router.use("/report", reportRoutes);

router.use("/employer", employerRoutes);
router.use("/messages", messageRoutes);
router.use("/sub-employer", subEmployerRoutes);

router.use("/notification", NotificationRoutes);

router.use("/contests", contestsRoutes);

export default router;
