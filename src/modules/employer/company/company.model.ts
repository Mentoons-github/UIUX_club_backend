import mongoose from "mongoose";

const EmployerCompanyUpdateSchema = new mongoose.Schema(
  {
    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employer",
      required: true,
    },

    companyName: String,
    industry: String,
    companySize: String,
    location: String,
    workLocation: String,
    turnover: String,
    perks: [String],
    companyAbout: String,
    website: String,
    jobTitle: String,
    jobType: String,
    designation: String,

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },

    reviewedAt: Date,
    rejectionReason: String,
  },
  {
    timestamps: true,
  },
);

const CompanyUpdateModel = mongoose.model(
  "EmployerCompanyUpdate",
  EmployerCompanyUpdateSchema,
);

export default CompanyUpdateModel;
