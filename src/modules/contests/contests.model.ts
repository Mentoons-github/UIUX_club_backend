import mongoose from "mongoose";

const WinnerSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rank: { type: Number, required: true },
    prizeWon: { type: Number, required: true },
    projectTitle: { type: String, required: true, trim: true },
    projectThumbnail: { type: String },
    submissionLink: { type: String },
  },
  { _id: false },
);

const ContestSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    shortDescription: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: [
        "UI/UX",
        "Icon Design",
        "Landing Page",
        "Typography",
        "Branding",
        "Other",
      ],
      required: true,
    },

    skillLevel: {
      type: String,
      enum: ["all", "beginner", "intermediate", "advanced"],
      default: "all",
    },
    mentorshipAvailable: { type: Boolean, default: false },

    coverImage: { type: String },
    featured: { type: Boolean, default: false },

    prize: {
      amount: { type: Number, required: true },
    },

    startDate: { type: Date, required: true },
    deadline: { type: Date, required: true },
    resultsDate: { type: Date },
    status: {
      type: String,
      enum: ["draft", "upcoming", "open", "closed"],
      default: "draft",
    },

    entriesCount: { type: Number, default: 0 },
    showcaseWinners: { type: Boolean, default: false },
    winners: { type: [WinnerSchema], default: [] },

    rules: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  },
  { timestamps: true },
);

ContestSchema.index({ status: 1, deadline: 1 });

const ContestModel = mongoose.model("Contest", ContestSchema);

export default ContestModel;
