import type { Request, Response } from "express";
import { recordJobView } from "./jobView.service";
import asyncHandler from "express-async-handler";

export const recordView = asyncHandler(async (req, res) => {
  const jobId = req.params.jobId as string;
  const userId = req.user!.id as string;

  await recordJobView(jobId, userId);

  res.status(200).json({ success: true });
});
