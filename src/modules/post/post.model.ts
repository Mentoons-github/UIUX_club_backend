import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    caption: {
      type: String,
      trim: true,
    },
    media: [
      {
        url: String,
        type: { type: String, enum: ["image", "video"] },
      },
    ],
    tags: [
      {
        // type: mongoose.Schema.Types.ObjectId,
        // ref: "Tags",
        type: String,
      },
    ],
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    likeCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
    shareCount: { type: Number, default: 0 },
    reportCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);
const PostModel = mongoose.model("Post", PostSchema);
export default PostModel;
