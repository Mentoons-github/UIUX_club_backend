import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
    },
    phone: {
      type: String,
    },
    role: {
      type: String,
      enum: ["admin", "user", "partner"],
      default: "user",
    },
    profilePicture: {
      type: String,
      required: false,
    },
    occupation: {
      type: String,
      required: false,
    },
    skills: {
      type: [String],
      default: [],
    },
    location: {
      type: String,
    },
    followersCount: {
      type: Number,
      default: 0,
    },
    followingCount: {
      type: Number,
      default: 0,
    },
    postsCount: {
      type: Number,
      default: 0,
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    blockedUsers: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      default: [],
    },
    blockedEmployers: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Employer",
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

userSchema.methods.toSafeObject = function () {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.__v;
  return userObject;
};

const User = mongoose.model("User", userSchema);

export default User;
