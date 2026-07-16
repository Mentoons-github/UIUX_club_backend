import { Schema, model, Types } from "mongoose";

const statusSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: ["text", "image", "video"],
      required: true,
    },

    text: String,
    backgroundColor: String,
    textColor: {
      type: String,
      default: "#FFFFFF",
    },

    media: {
      url: String,
    },

    caption: String,

    viewers: [
      {
        user: { type: Types.ObjectId, ref: "User" },
        viewedAt: { type: Date, default: Date.now },
      },
    ],

    viewersCount: {
      type: Number,
      default: 0,
    },

    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
      index: { expires: 0 },
    },
  },
  { timestamps: true },
);

statusSchema.index({ user: 1, createdAt: -1 });

export const StatusModel = model("Status", statusSchema);
