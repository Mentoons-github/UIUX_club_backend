import mongoose from "mongoose";

const LikeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Post",
    },
  },
  { timestamps: true },
);

LikeSchema.index({ user: 1, post: 1 }, { unique: true });
const LikeModel = mongoose.model("Like", LikeSchema);
export default LikeModel;
