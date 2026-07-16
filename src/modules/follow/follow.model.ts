import mongoose from "mongoose";

const FollowSchema = new mongoose.Schema({
  follower: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  following: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

FollowSchema.index(
  {
    follower: 1,
    following: 1,
  },
  { unique: true },
);

const FollowModel = mongoose.model("Follow", FollowSchema);

export default FollowModel;
