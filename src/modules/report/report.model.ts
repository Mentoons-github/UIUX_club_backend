import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema(
  {
    reporterId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "reporterType",
    },

    reporterType: {
      type: String,
      required: true,
      enum: ["User", "Employer"],
    },

    reportedId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "reportedType",
    },

    reportedType: {
      type: String,
      required: true,
      enum: ["User", "Employer"],
    },

    reason: {
      type: String,
      required: true,
      enum: [
        "Spam",
        "Harassment",
        "Fake Profile",
        "Inappropriate Content",
        "Scam",
        "Other",
      ],
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    status: {
      type: String,
      enum: ["Pending", "Reviewed", "Resolved", "Rejected"],
      default: "Pending",
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },

    reviewedAt: {
      type: Date,
    },

    adminNote: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const ReportModel = mongoose.model("Report", ReportSchema);

export default ReportModel;
