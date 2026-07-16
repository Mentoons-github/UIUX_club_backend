import mongoose from "mongoose";

const DesignLikeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    design: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "DesignShowcase",
    },
  },
  { timestamps: true },
);

DesignLikeSchema.index({ user: 1, design: 1 }, { unique: true });

const DesignLikeModel = mongoose.model("DesignLike", DesignLikeSchema);
export default DesignLikeModel;
