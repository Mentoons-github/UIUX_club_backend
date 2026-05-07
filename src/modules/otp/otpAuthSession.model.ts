import mongoose from "mongoose";

const OTPAuthSessionSchema = new mongoose.Schema({
  email: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String, required: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  purpose: {
    type: String,
    enum: ["register", "login", "reset-password"],
    required: true,
  },
  lastSentAt: { type: Date, default: Date.now },
});

OTPAuthSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const OTPAuthSessionModel = mongoose.model("AuthSession", OTPAuthSessionSchema);
export default OTPAuthSessionModel;
