import mongoose from "mongoose";

const linkPreviewCacheSchema = new mongoose.Schema(
  {
    url: { type: String, required: true, unique: true },
    data: {
      url: { type: String, required: true },
      title: { type: String, default: null },
      description: { type: String, default: null },
      image: {
        url: { type: String, default: null },
      },
      logo: {
        url: { type: String, default: null },
      },
      publisher: { type: String, default: null },
      author: { type: String, default: null },
    },
  },
  { timestamps: true },
);

linkPreviewCacheSchema.index({ createdAt: 1 }, { expireAfterSeconds: 604800 });

const LinkPreviewCache = mongoose.model(
  "LinkPreviewCache",
  linkPreviewCacheSchema,
);

export default LinkPreviewCache;
