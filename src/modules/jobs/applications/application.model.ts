import mongoose from "mongoose";

const ExperienceSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: true,
      trim: true,
    },

    role: {
      type: String,
      required: true,
      trim: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
    },

    currentlyWorking: {
      type: Boolean,
      default: false,
    },

    description: {
      type: String,
      trim: true,
    },
  },
  {
    _id: false,
  },
);

const JobApplicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Jobs",
      required: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
    },

    age: {
      type: Number,
      required: true,
    },

    gender: {
      type: String,
      enum: ["male", "female", "non-binary", "prefer-not-to-say"],
      required: true,
    },

    country: {
      type: String,
      required: true,
      trim: true,
    },

    state: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },

    whatsappNumber: {
      type: String,
      required: true,
      trim: true,
    },

    resume: {
      type: String,
      required: true,
      trim: true,
    },

    portfolioLink: {
      type: String,
      trim: true,
    },

    totalExperienceYears: {
      type: Number,
      default: 0,
    },

    experience: {
      type: [ExperienceSchema],
      default: [],
    },

    status: {
      type: String,
      enum: [
        "pending",
        "reviewed",
        "shortlisted",
        "interview",
        "accepted",
        "rejected",
      ],
      default: "pending",
    },
    screeningAnswers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ScreeningAnswer",
      },
    ],
  },
  {
    timestamps: true,
  },
);

JobApplicationSchema.index({ user: 1, job: 1 }, { unique: true });

const JobApplicationModel = mongoose.model(
  "JobApplications",
  JobApplicationSchema,
);

export default JobApplicationModel;
