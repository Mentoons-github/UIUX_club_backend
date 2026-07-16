import mongoose from "mongoose";

const JobOrderSchema = new mongoose.Schema(
  {
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employer",
      required: true,
    },
    planTag: { type: String, required: true },
    slotsPurchased: { type: Number, required: true, min: 1 },
    slotsUsed: { type: Number, required: true, default: 0 },
    daysPerListing: { type: Number, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    paymentGatewayOrderId: { type: String },
    paymentGatewayPaymentId: { type: String },
  },
  { timestamps: true },
);

export const JobOrderModel = mongoose.model("JobOrder", JobOrderSchema);
