import asyncHandler from "express-async-handler";
import { successResponse } from "../../utils";
import { createReport } from "./report.service";

export const reportUser = asyncHandler(async (req, res) => {
  const reporterId = req.user!.id;

  await createReport({
    reporterId,
    reporterType: req.user!.role === "employer" ? "Employer" : "User",
    reportedId: req.params.userId as string,
    reportedType: "User",
    reason: req.body.reason,
    description: req.body.description,
  });

  return successResponse(res, 201, "User reported successfully");
});

export const reportEmployer = asyncHandler(async (req, res) => {
  const reporterId = req.user!.id;

  await createReport({
    reporterId,
    reporterType: req.user!.role === "employer" ? "Employer" : "User",
    reportedId: req.params.employerId as string,
    reportedType: "Employer",
    reason: req.body.reason,
    description: req.body.description,
  });

  return successResponse(res, 201, "Employer reported successfully");
});
