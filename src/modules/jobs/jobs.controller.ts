import asyncHandler from "express-async-handler";
import {
  createJobService,
  extendJobExpiryDate,
  findJobByIdStrictService,
  findJobsByCategory,
  getAllJobsService,
  getMyJobs,
  getSuggestedJobsForUser,
  updateJobData,
} from "./jobs.service";
import { getPagination, successResponse } from "../../utils";
import { JobCategory } from "./jobs.type";
import { resolveEmployerId } from "./helpers/resolevEmployer.helper";

export const createJob = asyncHandler(async (req, res) => {
  console.log("reached crate job");
  const employerId = req.user!.id;
  const data = req.body;
  const createdJob = await createJobService(employerId, data);
  return successResponse(res, 200, "Jobs created", createdJob);
});

export const getAllJobs = asyncHandler(async (req, res) => {
  const pageParam = req.query.page as string;
  const limitParam = req.query.limit as string;
  const userId = req.user?.id;

  const { page, limit } = getPagination(pageParam, limitParam);

  const jobs = await getAllJobsService(page, limit, userId);
  return successResponse(res, 200, "Jobs fetched", jobs);
});

export const getJobsByType = asyncHandler(async (req, res) => {
  const type = req.params.type as JobCategory;
  const pageParam = req.query.page as string;
  const limitParam = req.query.limit as string;
  const userId = req.user?.id;

  const { page, limit } = getPagination(pageParam, limitParam);
  const { jobs, total } = await findJobsByCategory({
    category: type,
    page,
    limit,
    userId,
  });
  return successResponse(res, 200, "Jobs fetched by type", {
    data: jobs,
    total,
  });
});

export const getJobById = asyncHandler(async (req, res) => {
  const jobId = req.params.jobId as string;
  const userId = req.user?.id;
  const job = await findJobByIdStrictService(jobId, userId);
  console.log(job);
  return successResponse(res, 200, "Job fetched by type", job);
});

export const getSuggestedJobs = asyncHandler(async (req, res) => {
  console.log("reached suggested jobs");
  const userId = req.user!.id;
  const limit = Number(req.query.limit) || 4;
  console.log("getting jobs");

  const jobs = await getSuggestedJobsForUser(String(userId), limit);

  console.log(jobs);
  return successResponse(res, 200, "Suggested jobs fetched successfully", jobs);
});

export const getEmployerJobs = asyncHandler(async (req, res) => {
  const employerId = await resolveEmployerId(req.user!);
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 6;
  const search = (req.query.search as string) || "";

  const jobs = await getMyJobs(employerId, page, limit, search);

  console.log(jobs);
  return successResponse(res, 200, "Jobs fetched", jobs);
});

export const extendJobExpiry = asyncHandler(async (req, res) => {
  const employerId = req.user!.id;
  const { date } = req.body;
  const jobId = req.params.jobId as string;

  const job = await extendJobExpiryDate(jobId, date, employerId);

  return successResponse(res, 201, "Extended job expiry date", job);
});

export const editJobs = asyncHandler(async (req, res) => {
  const jobId = req.params.jobId as string;
  const jobData = req.body;

  console.log(jobId, jobData);

  await updateJobData(jobData, jobId);

  return successResponse(res, 201, "Job edited");
});
