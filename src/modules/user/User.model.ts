import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
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
    phone: {
      type: String,
      required: false,
      unique: true,
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
    location: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

UserSchema.methods.toSafeObject = function () {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.__v;
  return userObject;
};

const User = mongoose.model("User", UserSchema);

export default User;
