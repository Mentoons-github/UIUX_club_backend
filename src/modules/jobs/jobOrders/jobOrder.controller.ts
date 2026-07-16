import { JobOrderModel } from "./jobOrder.model";
export const FREE_POST_DURATION_DAYS = 15;

export const claimJobOrderSlot = async (employerId: string) => {
  return await JobOrderModel.findOneAndUpdate(
    {
      employer: employerId,
      paymentStatus: "paid",
      $expr: { $lt: ["$slotsUsed", "$slotsPurchased"] },
    },
    { $inc: { slotsUsed: 1 } },
    { new: true },
  );
};

export const getListingExpiryDate = (daysPerListing: number) => {
  return new Date(Date.now() + daysPerListing * 24 * 60 * 60 * 1000);
};
