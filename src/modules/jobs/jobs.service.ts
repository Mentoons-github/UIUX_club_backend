import { normalize } from "../../utils";
import AppError from "../../utils/AppError";
import { getUserShowcaseProfile } from "../designShowcase";
import { getApplicationCountsByJobIds } from "./applications/application.service";
import {
  claimJobOrderSlot,
  FREE_POST_DURATION_DAYS,
  getListingExpiryDate,
} from "./jobOrders/jobOrder.controller";
import { CATEGORY_TO_JOB_TAG_MAP } from "./jobs.contants";
import JobModel from "./jobs.model";
import { IJob, JobCategory } from "./jobs.type";
import { getViewCountsByJobIds } from "./jobViews/jobView.service";
import { isJobSaved } from "./savedJobs/savedJob.service";

export const getAllJobsService = async (
  page: number = 1,
  limit: number = 5,
  userId?: string,
) => {
  const skip = (page - 1) * limit;

  const jobs = await JobModel.aggregate([
    {
      $sort: { createdAt: -1 },
    },

    {
      $group: {
        _id: "$category",

        jobs: {
          $push: "$$ROOT",
        },
      },
    },

    {
      $project: {
        _id: 0,

        category: "$_id",

        jobs: {
          $slice: ["$jobs", skip, limit],
        },
      },
    },
  ]);

  const jobsWithSaved = await Promise.all(
    jobs.map(async (categoryGroup) => {
      const updatedJobs = await Promise.all(
        categoryGroup.jobs.map(async (job: any) => {
          const isSaved = userId
            ? await isJobSaved(userId, job._id.toString())
            : false;

          return {
            ...job,
            isSaved,
          };
        }),
      );

      return {
        ...categoryGroup,
        jobs: updatedJobs,
      };
    }),
  );

  return jobsWithSaved;
};

export const findJobsByCategory = async ({
  category,
  page,
  limit,
  userId,
}: {
  category: JobCategory;
  page: number;
  limit: number;
  userId?: string;
}) => {
  if (category.trim() === "") {
    throw new AppError("No category found", 404);
  }

  const skip = (page - 1) * limit;

  const [jobs, total] = await Promise.all([
    JobModel.find({ category }).sort({ createdAt: -1 }).skip(skip).limit(limit),

    JobModel.countDocuments({ category }),
  ]);

  const jobsWithSaved = await Promise.all(
    jobs.map(async (job) => {
      const isSaved = userId
        ? await isJobSaved(userId, job._id.toString())
        : false;

      return {
        ...job.toObject(),
        isSaved,
      };
    }),
  );

  return {
    jobs: jobsWithSaved,
    total,
  };
};

export const findJobByIdStrictService = async (
  jobId: string,
  userId?: string,
) => {
  if (!jobId) throw new AppError("No jobId found", 404);

  const [job, isSaved] = await Promise.all([
    JobModel.findById(jobId),
    userId ? isJobSaved(userId, jobId) : Promise.resolve(false),
  ]);

  if (!job) throw new AppError("Job not found", 404);

  return {
    ...job.toObject(),
    isSaved,
  };
};

export const getAllJobs = async () => {
  return JobModel.find().lean();
};

export const getJobById = async (jobId: string) => {
  return JobModel.findById(jobId).lean();
};

export const createJobService = async (employerId: string, data: IJob) => {
  const existingJobsCount = await JobModel.countDocuments({ employerId });

  console.log("existing job :", existingJobsCount);
  console.log("no job found");
  if (existingJobsCount === 0) {
    console.log("job creating");
    return await JobModel.create({
      ...data,
      employerId,
      isFreePost: true,
      expiresAt: getListingExpiryDate(FREE_POST_DURATION_DAYS),
    });
  }

  const availableOrder = await claimJobOrderSlot(employerId);
  console.log("available orders :", availableOrder);

  if (!availableOrder) {
    console.log("no slots available");
    throw new Error("Please purchase a job listing plan to post more jobs.");
  }

  return await JobModel.create({
    ...data,
    employerId,
    jobOrder: availableOrder._id,
    isFreePost: false,
    expiresAt: getListingExpiryDate(availableOrder.daysPerListing),
  });
};

export const updateJob = async (jobId: string, data: any) => {
  return JobModel.findByIdAndUpdate(jobId, data, { new: true }).lean();
};

export const deleteJob = async (jobId: string) => {
  return JobModel.findByIdAndDelete(jobId).lean();
};

export const getSuggestedJobsForUser = async (userId: string, limit = 4) => {
  const { tools: userTools, categories: userCategories } =
    await getUserShowcaseProfile(userId);

  const categoryKeywords = new Set<string>();

  for (const cat of userCategories) {
    const mapped = CATEGORY_TO_JOB_TAG_MAP[cat] ?? [];

    mapped.forEach((k) => categoryKeywords.add(normalize(k)));
  }

  const jobs = await JobModel.find().lean();

  const scored = jobs.map((job) => {
    let score = 0;

    const jobSkillsNorm = (job.skills ?? []).map(normalize);
    const jobTagsNorm = (job.tags ?? []).map(normalize);
    const jobTagNorm = normalize(job.tag ?? "");

    for (const tool of userTools) {
      if (jobSkillsNorm.includes(tool)) {
        score += 3;
        console.log(`+3 Skill Match -> ${tool}`);
      }

      if (jobTagsNorm.includes(tool)) {
        score += 2;
        console.log(`+2 Tag Match -> ${tool}`);
      }

      if (jobTagNorm === tool) {
        score += 1;
        console.log(`+1 Main Tag Match -> ${tool}`);
      }
    }

    for (const keyword of categoryKeywords) {
      if (jobSkillsNorm.some((s) => s.includes(keyword))) {
        score += 2;
        console.log(`+2 Category Skill Match -> ${keyword}`);
      }

      if (jobTagsNorm.some((t) => t.includes(keyword))) {
        score += 1;
        console.log(`+1 Category Tag Match -> ${keyword}`);
      }

      if (jobTagNorm.includes(keyword)) {
        score += 1;
        console.log(`+1 Category Main Tag Match -> ${keyword}`);
      }
    }

    return { job, score };
  });

  scored.forEach((item) => {
    console.log({
      title: item.job.title,
      id: item.job._id,
      score: item.score,
    });
  });

  const results = scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.job);

  if (results.length < 3) {
    const fallbackIds = new Set(results.map((j) => String(j._id)));

    const fallback = jobs
      .filter((j) => !fallbackIds.has(String(j._id)))
      .slice(0, limit - results.length);

    return [...results, ...fallback];
  }

  return results;
};

export const getMyJobs = async (
  employerId: string,
  page: number = 1,
  limit: number = 6,
  search: string = "",
) => {
  console.log(employerId);
  if (!employerId) {
    throw new AppError("No Employer found", 404);
  }

  const skip = (page - 1) * limit;

  const filter: Record<string, unknown> = {
    employerId,
    status: "active",
    ...(search.trim() && {
      role: { $regex: search.trim(), $options: "i" },
    }),
  };

  const jobs = await JobModel.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  console.log("jobs :", jobs);

  const jobIds = jobs.map((job) => job._id.toString());

  const [viewCounts, applicationCounts] = await Promise.all([
    getViewCountsByJobIds(jobIds),
    getApplicationCountsByJobIds(jobIds),
  ]);

  const viewMap = new Map(
    viewCounts.map((item) => [item._id.toString(), item.count]),
  );

  const applicationMap = new Map(
    applicationCounts.map((item) => [item._id.toString(), item.count]),
  );

  const jobsWithAnalytics = jobs.map((job) => ({
    ...job,
    views: viewMap.get(job._id.toString()) || 0,
    applications: applicationMap.get(job._id.toString()) || 0,
  }));

  const total = await JobModel.countDocuments(filter);

  return {
    jobs: jobsWithAnalytics,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

export const getJobsByEmployerId = async (employerId: string) => {
  const jobs = await JobModel.find({
    employerId,
  }).select("_id");
  return jobs;
};

export const extendJobExpiryDate = async (
  jobId: string,
  date: string,
  employerId: string,
) => {
  if (!jobId) throw new AppError("No jobId found", 400);
  const job = await JobModel.findOneAndUpdate(
    { _id: jobId, employerId },
    {
      $set: {
        expiresAt: new Date(date),
      },
    },
    {
      new: true,
    },
  );

  if (!job) {
    throw new AppError("Job not found", 404);
  }

  return job;
};

export const updateJobData = async (jobData: IJob, jobId: string) => {
  if (!jobId) throw new AppError("No jobId found", 408);

  const { _id, employerId, ...updatableFields } = jobData;

  const job = await JobModel.findByIdAndUpdate(jobId, updatableFields, {
    new: true,
    runValidators: true,
  });

  if (!job) throw new AppError("Job not found", 404);

  return job;
};
