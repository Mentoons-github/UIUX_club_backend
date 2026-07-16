import mongoose from "mongoose";
import AppError from "../../../utils/AppError";
import { findJobByIdStrictService, getJobById } from "../jobs.service";
import { ApplicationStatusValue, ApplyJobData } from "./application.types";
import JobApplicationModel from "./application.model";
import { APPLICATION_STATUSES } from "./application.constants";
import { createScreeningAnswersService } from "../screeningAnswer";
import { getActiveOrders } from "../jobOrders/jobOrder.service";

//apply job
export const applyJobService = async ({
  userId,
  jobId,
  applicationData,
}: {
  userId: string;
  jobId: string;
  applicationData: ApplyJobData;
}) => {
  await findJobByIdStrictService(jobId);

  let screeningAnswerIds: string[] = [];

  if (applicationData.screeningAnswers) {
    console.log("creening answers exists :", applicationData.screeningAnswers);
    const answers = await createScreeningAnswersService(
      applicationData.screeningAnswers,
    );

    console.log(answers);

    screeningAnswerIds = answers.map((answer) => answer._id.toString());
  }

  const application = await JobApplicationModel.create({
    user: userId,
    job: jobId,
    ...applicationData,
    screeningAnswers: screeningAnswerIds,
  });

  return application;
};

export const isApplicationExistsStrictService = async (
  userId: string,
  jobId: string,
) => {
  const applicationExists = await findExistingApplication(userId, jobId);
  if (applicationExists) {
    throw new AppError("You have already applied for this job", 409);
  }

  return applicationExists;
};

//get Application by ID strict
export const getApplicationByIdStrictService = async (
  applicationId: string,
) => {
  if (!applicationId) {
    throw new AppError("No applicationId found", 404);
  }

  const application = await JobApplicationModel.findById(applicationId);

  if (!application) {
    throw new AppError("application not found", 404);
  }

  return application;
};

//find Existing Application
export const findExistingApplication = async (
  userId: string,
  jobId: string,
) => {
  const isExists = await JobApplicationModel.findOne({
    job: jobId,
    user: userId,
  });
  return isExists;
};

export const getApplicationCountsByJobIds = async (jobIds: string[]) => {
  return JobApplicationModel.aggregate([
    {
      $match: {
        job: {
          $in: jobIds.map((id) => new mongoose.Types.ObjectId(id)),
        },
      },
    },
    {
      $group: {
        _id: "$job",
        count: { $sum: 1 },
      },
    },
  ]);
};

export const fetchJobApplicants = async (
  employerId: string,
  jobId: string,
  page: number = 1,
  limit: number = 6,
) => {
  if (!employerId) {
    throw new AppError("No Employer found", 404);
  }

  const job = await getJobById(jobId);

  if (!job) {
    throw new AppError("Job not found", 404);
  }

  const skip = (page - 1) * limit;

  const [applications, total] = await Promise.all([
    JobApplicationModel.find({
      job: jobId,
    })
      .populate("user", "firstName lastName profileImage")
      .populate("job", "title company.name location type salary")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    JobApplicationModel.countDocuments({
      job: jobId,
    }),
  ]);

  return {
    applications,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPreviousPage: page > 1,
    },
  };
};

export const fetchApplicantById = async (
  employerId: string,
  applicationId: string,
) => {
  if (!employerId) {
    throw new AppError("No Employer found", 404);
  }

  const application = await JobApplicationModel.findById(applicationId)
    .populate("user", "firstName lastName profileImage _id")
    .populate(
      "job",
      "title company.name location type salary employerId screeningQuestions",
    )
    .populate("screeningAnswers");

  if (!application) {
    throw new AppError("Application not found", 404);
  }

  const job = application.job as any;

  if (job.employerId.toString() !== employerId) {
    throw new AppError("You are not authorized to view this applicant", 403);
  }

  const screeningQA = (application.screeningAnswers as any[]).map((ans) => {
    const questionDef = job.screeningQuestions.find(
      (q: any) => q._id.toString() === ans.questionId.toString(),
    );
    return {
      answerId: ans._id,
      questionId: ans.questionId,
      question: ans.question,
      answer: ans.answer,
      required: questionDef?.required ?? false,
    };
  });

  const activeOrder = await getActiveOrders(employerId);

  console.log(activeOrder);

  const isUnlocked = Boolean(activeOrder);

  const appObj = application.toObject();

  return {
    ...appObj,
    screeningAnswers: screeningQA,
    isUnlocked,
  };
};

export const updateApplicationStatusService = async (
  employerId: string,
  applicationId: string,
  status: string,
) => {
  if (!employerId) {
    throw new AppError("No Employer found", 404);
  }

  if (!APPLICATION_STATUSES.includes(status as ApplicationStatusValue)) {
    throw new AppError(
      `Invalid status. Must be one of: ${APPLICATION_STATUSES.join(", ")}`,
      400,
    );
  }

  const application = await getApplicationByIdStrictService(applicationId);
  const job = await getJobById(application.job.toString());

  if (!job) {
    throw new AppError("Job not found", 404);
  }

  if (job.employerId.toString() !== employerId) {
    throw new AppError(
      "You are not authorized to update this application",
      403,
    );
  }

  application.status = status as ApplicationStatusValue;
  await application.save();

  return application;
};
