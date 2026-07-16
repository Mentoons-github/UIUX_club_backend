import asyncHandler from "express-async-handler";
import { saveJobService, unsaveJobService } from "./savedJob.service";
import { successResponse } from "../../../utils";

export const saveJob = asyncHandler(async (req, res) => {
  const jobId = req.params.jobId as string;
  const userId = req.user!.id;
  const saved = await saveJobService(userId, jobId);

  return successResponse(res, 200, "Job saved successfully", saved);
});

export const unsaveJob = asyncHandler(async (req, res) => {
  const jobId = req.params.jobId as string;
  const userId = req.user!.id;
  await unsaveJobService(userId, jobId);
  return successResponse(res, 200, "Job unsaved successfully", null);
});
