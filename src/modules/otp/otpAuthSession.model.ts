import mongoose from "mongoose";

const OTPAuthSessionSchema = new mongoose.Schema(
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
      enum: ["register", "login", "reset-password"],
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
  },
  {
    timestamps: true,
  },
);

OTPAuthSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
const OTPAuthSessionModel = mongoose.model("AuthSession", OTPAuthSessionSchema);
export default OTPAuthSessionModel;
