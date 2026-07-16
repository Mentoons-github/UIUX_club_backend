import mongoose from "mongoose";
import { JOB_STATUS_ENUM } from "./jobs.contants";

const jobSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ["internship", "uiux", "freelancers"],
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    tag: {
      type: String,
    },
    skills: {
      type: [String],
      default: [],
      validate: [(val: string[]) => val.length <= 30, "Too many skills"],
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    role: {
      type: String,
      required: true,
      trim: true,
    },

    company: {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      logo: {
        type: String,
        trim: true,
        default: "",
      },
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: [
        "Full-time",
        "Hybrid",
        "On-site",
        "Contract",
        "Project",
        "Ongoing",
        "Remote",
      ],
      required: true,
    },

    salary: {
      type: String,
      required: true,
      trim: true,
    },

    tags: {
      type: [String],
      default: [],
    },

    paid: {
      type: Boolean,
      default: true,
    },

    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employer",
      required: true,
    },
    status: {
      type: String,
      enum: JOB_STATUS_ENUM,
      default: "active",
    },
    isFreePost: {
      type: Boolean,
      default: false,
    },
    jobOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobOrder",
      default: null,
    },
    expiresAt: {
      type: Date,
      required: true,
    },

    screeningQuestions: {
      type: [
        {
          question: {
            type: String,
            required: true,
            trim: true,
          },
          required: {
            type: Boolean,
            default: true,
          },
        },
      ],
      default: [],
    },
    benefits: [String],
    responsibilities: [String],
    requirements: [String],
    preferredQualifications: [String],

    featured: {
      type: Boolean,
      default: false,
    },
    featuredUntil: Date,
  },
  {
    timestamps: true,
  },
);

const JobModel = mongoose.model("Jobs", jobSchema);

export default JobModel;
