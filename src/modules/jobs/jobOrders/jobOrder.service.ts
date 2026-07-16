import AppError from "../../../utils/AppError";
import { JobOrderModel } from "./jobOrder.model";

export const getActiveOrders = async (employerId: string) => {
  try {
    const activeOrder = await JobOrderModel.findOne({
      employer: employerId,
      paymentStatus: "paid",
      $expr: { $lt: ["$slotsUsed", "$slotsPurchased"] },
    }).sort({ createdAt: -1 });

    return activeOrder;
  } catch (error) {
    console.log(error);
    throw new AppError("Internal Server error", 500);
  }
};
