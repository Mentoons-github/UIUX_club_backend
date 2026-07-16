import mongoose from "mongoose";

const otpAuthSessionSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      index: true,
    },

    otp: {
      type: String,
      required: true,
    },

    purpose: {
      type: String,
      enum: ["register", "login", "reset-password", "employer-register"],
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    lastSentAt: {
      type: Date,
      default: Date.now,
    },

    firstName: {
      type: String,
    },

    lastName: {
      type: String,
    },

    password: {
      type: String,
    },

    employerData: {
      type: Object,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

otpAuthSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
const otpAuthSessionModel = mongoose.model("AuthSession", otpAuthSessionSchema);
export default otpAuthSessionModel;
