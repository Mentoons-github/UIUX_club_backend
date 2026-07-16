import mongoose from "mongoose";

const LinkPreviewSchema = new mongoose.Schema(
  {
    title: { type: String },
    description: { type: String },
    url: { type: String },
    publisher: { type: String },
    author: { type: String },
    image: {
      url: { type: String },
      type: { type: String },
      width: { type: Number },
      height: { type: Number },
      size: { type: Number },
      size_pretty: { type: String },
    },
    logo: {
      url: { type: String },
      type: { type: String },
      width: { type: Number },
      height: { type: Number },
      size: { type: Number },
      size_pretty: { type: String },
    },
  },
  { _id: false },
);

const DesignShowcaseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    caption: {
      type: String,
    },
    thumbnail: {
      type: String,
    },
    images: [
      {
        type: String,
      },
    ],
    videoUrls: [
      {
        type: String,
      },
    ],
    tools: [
      {
        type: String,
      },
    ],
    category: {
      type: String,
      enum: [
        "UI Design",
        "UX Research",
        "Prototypes",
        "Case Studies",
        "Motion",
        "Branding",
      ],
    },
    linkPreview: {
      type: LinkPreviewSchema,
      default: null,
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    feedbackCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

DesignShowcaseSchema.index({ user: 1, createdAt: -1 });

const DesignShowcaseModel = mongoose.model(
  "DesignShowcase",
  DesignShowcaseSchema,
);

export default DesignShowcaseModel;
