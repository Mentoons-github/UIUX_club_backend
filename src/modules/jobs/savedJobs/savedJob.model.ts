import mongoose from "mongoose";

const savedJobsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
  },
  { timestamps: true },
);

savedJobsSchema.index({ user: 1, job: 1 }, { unique: true });

export const SavedJobModel = mongoose.model("SavedJob", savedJobsSchema);
