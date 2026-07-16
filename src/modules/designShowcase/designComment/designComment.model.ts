import mongoose from "mongoose";

const DesignCommentSchema = new mongoose.Schema(
  {
    design: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "DesignShowcase",
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxLength: 1000,
    },
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DesignComment",
      default: null,
    },
  },
  { timestamps: true },
);

DesignCommentSchema.index({ design: 1, parentComment: 1 });
DesignCommentSchema.index({ parentComment: 1 });

const DesignCommentModel = mongoose.model("DesignComment", DesignCommentSchema);
export default DesignCommentModel;
