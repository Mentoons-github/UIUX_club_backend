import mongoose from "mongoose";

const EmployerSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 18, max: 100 },
    profilePicture: { type: String },
    designation: { type: String, required: true },
    designationOther: { type: String },
    companyName: { type: String, required: true, trim: true },
    industry: { type: String, required: true },
    companySize: { type: String, required: true },
    location: { type: String, required: true },
    turnover: { type: String },
    perks: { type: [String], default: [] },
    companyAbout: { type: String },
    mobile: { type: String, required: true },
    whatsapp: { type: String, required: true },
    website: { type: String, required: true },
    jobTitle: { type: String, required: true },
    jobType: { type: String, required: true },
    workLocation: { type: String, required: true },
    expLevel: { type: String, required: true },
    jobDescription: { type: String, required: true },
    workEmail: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    isWorkEmailVerified: { type: Boolean, default: false },
    pendingWorkEmail: { type: String, lowercase: true, trim: true },
    emailVerificationTokenHash: { type: String, select: false },
    emailVerificationExpires: { type: Date, select: false },
    password: { type: String, required: true },
    role: { type: String, default: "employer" },
    isVerified: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    refreshToken: { type: String },
    blockedUsers: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      default: [],
    },

    hasUsedFreeJob: { type: Boolean, default: false },
    availableSlots: { type: Number, default: 0, min: 0 },
    totalSlotsPurchased: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const EmployerModel = mongoose.model("Employer", EmployerSchema);
export default EmployerModel;
