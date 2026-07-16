import AppError from "../../../utils/AppError";
import { SavedJobModel } from "./savedJob.model";

export const saveJobService = async (userId: string, jobId: string) => {
  if (!jobId) {
    throw new AppError("No job found to save", 404);
  }

  const isExisting = await isJobSaved(userId, jobId);
  console.log(isExisting);

  if (isExisting) {
    throw new AppError("Job already saved", 409);
  }

  console.log("saving");
  const saved = await SavedJobModel.create({
    user: userId,
    job: jobId,
  });

  return saved;
};

export const unsaveJobService = async (userId: string, jobId: string) => {
  const deleted = await SavedJobModel.findOneAndDelete({
    user: userId,
    job: jobId,
  });
  if (!deleted) {
    throw new AppError("Saved job not found", 404);
  }
  return deleted;
};

export const isJobSaved = async (userId: string, jobId: string) => {
  const isExisting = await SavedJobModel.exists({ user: userId, job: jobId });
  console.log(isExisting);
  return !!isExisting;
};
