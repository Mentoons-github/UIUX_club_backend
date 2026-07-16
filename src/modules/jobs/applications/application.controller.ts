import asyncHandler from "express-async-handler";
import {
  applyJobService,
  fetchApplicantById,
  fetchJobApplicants,
  isApplicationExistsStrictService,
  updateApplicationStatusService,
} from "./application.service";
import { successResponse } from "../../../utils";
import { uploadResumeService } from "../../media";
import { findUserById } from "../../user";
import { resolveEmployerId } from "../helpers/resolevEmployer.helper";

export const applyJob = asyncHandler(async (req, res) => {
  console.log("reached apply job");
  const userId = req.user!.id;
  const jobId = req.params.jobId as string;

  await isApplicationExistsStrictService(userId, jobId);

  const user = await findUserById(userId);
  const username = `${user.firstName}-${user.lastName}`
    .replace(/\s+/g, "-")
    .toLowerCase();

  const applicationData = req.body;

  let resumeUrl = "";

  if (req.file) {
    resumeUrl = await uploadResumeService(req.file, userId, username);
  }

  await applyJobService({
    userId,
    jobId,
    applicationData: {
      ...applicationData,
      resume: resumeUrl,
    },
  });

  return successResponse(res, 200, "Applied Successfully");
});

export const getEmployerApplicants = asyncHandler(async (req, res) => {
  const employerId = req.user!.id;
  const jobId = req.params.jobId as string;

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 6;

  const result = await fetchJobApplicants(employerId, jobId, page, limit);

  return successResponse(res, 200, "Applicants fetched successfully", result);
});

export const getApplicantById = asyncHandler(async (req, res) => {
  const employerId = await resolveEmployerId(req.user!);
  const applicationId = req.params.applicationId as string;

  const result = await fetchApplicantById(employerId, applicationId);

  console.log("result data : ", result);

  return successResponse(res, 200, "Applicant fetched successfully", result);
});

export const updateApplicationStatus = asyncHandler(async (req, res) => {
  const employerId = await resolveEmployerId(req.user!);
  const application = await updateApplicationStatusService(
    employerId,
    req.params.applicationId as string,
    req.body.status,
  );

  return successResponse(
    res,
    200,
    "Application status updated successfully",
    application,
  );
});
