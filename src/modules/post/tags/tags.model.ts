import mongoose from "mongoose";

const TagsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
  },
  { timestamps: true },
);

const TagsModel = mongoose.model("Tags", TagsSchema);
export default TagsModel;
