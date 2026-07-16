import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
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

likeSchema.index({ user: 1, post: 1 }, { unique: true });
const LikeModel = mongoose.model("Like", likeSchema);
export default LikeModel;
