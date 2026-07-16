import mongoose from "mongoose";
import JobViewModel from "./jobView.model";

export const recordJobView = async (jobId: string, userId: string) => {
  const exists = await JobViewModel.findOne({
    jobId: new mongoose.Types.ObjectId(jobId),
    userId: new mongoose.Types.ObjectId(userId),
  });

  if (exists) return;

  await JobViewModel.create({
    jobId: new mongoose.Types.ObjectId(jobId),
    userId: new mongoose.Types.ObjectId(userId),
  });
};

export const getViewCountsByJobIds = async (jobIds: string[]) => {
  return JobViewModel.aggregate([
    {
      $match: {
        jobId: {
          $in: jobIds.map((id) => new mongoose.Types.ObjectId(id)),
        },
      },
    },
    {
      $group: {
        _id: "$jobId",
        count: { $sum: 1 },
      },
    },
  ]);
};
